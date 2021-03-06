function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

const swallLoginPrompt = function(){
	Swal.fire({
		html: `	
				<div class="container-fluid">
					<div class="row">
						<div class="col-sm-12 text-center mt-3 mb-2">
							<small>Guest Book</small>
							<h1 class="asepnabila mb-0">Asep<span style="font-size: 1.5rem;margin-left: .4rem;">&amp;</span>Nabila</h1>
							<small>Wedding's</small>
						</div>
				</div>
				<div class="text-muted pb-2">
					<small>Kamu harus login untuk mengakses halaman ini!</small>
				</div>
				<div id="googleLoginButton"></div>`,
		width: 'auto',
		height: 'auto',
		showCancelButton: false,
		background: '#FFFAFF',
		backdrop: '#730f66',
		allowOutsideClick: false,
		allowEscapeKey: false,
		showConfirmButton: false,
		customClass : {
			popup: 'close-envelope-popup'
		},
		didOpen: () => {
			google.accounts.id.renderButton(
				document.getElementById("googleLoginButton"),
				{ theme: "outline", size: "large" }  // customization attributes
			);
			google.accounts.id.prompt(); // also display the One Tap dialog
		}
	});
}

let googleResponseCredential;
function handleGoogleCredentialResponse(response) {
	console.log("Encoded JWT ID token: " + response.credential);
	googleResponseCredential = response.credential;
	
	console.log(googleResponseCredential);
	
	let decodeGoogleCredential = parseJwt(googleResponseCredential);
	$.getJSON(`https://script.google.com/macros/s/AKfycbyFeS9ghi4Cj44eguhffRmT1bqHrI94mYLA3pS6fjXpW5YokJq7GIAojYCp-VIaBKic/exec?action=checkAllowedLoggedinEmail&vc1ycvwbf6zuqyn1cf=true&loggedinemail=${decodeGoogleCredential.email}`).done((response) => {
		if(response.statusCode == 1){
			localStorage.googleCredentials = googleResponseCredential;
			
			googleCredentials = localStorage.googleCredentials;
			if(typeof googleCredentials == 'undefined' || googleCredentials == ''){
				swallLoginPrompt();
			}else{
				showGuestBooks();
			}
		}else{
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: response.statusText,
			}).then((result) => {
				if (result.isConfirmed) {
					location.reload();
				}
			});
		}
	});
}

const showGuestBooks = function(){
	Swal.close();
	
	if(typeof googleCredentials == 'undefined' || googleCredentials == ''){
		swallLoginPrompt();
	}else{
		const responsePayload = parseJwt(googleCredentials);
		console.log("ID: " + responsePayload.sub);
		console.log('Full Name: ' + responsePayload.name);
		console.log('Given Name: ' + responsePayload.given_name);
		console.log('Family Name: ' + responsePayload.family_name);
		console.log("Image URL: " + responsePayload.picture);
		console.log("Email: " + responsePayload.email);
		
		$("#loggedin-avatar").attr("src", responsePayload.picture);
		$("#loggedin-name").text(responsePayload.given_name);
		
		$('.xhidden').each(function() {
			$(this).addClass('animate__animated animate__slideInUp');
			$(this).css('visibility', 'visible');
		});
		
		loadGuestBooks();
	}
}

const loadGuestBooks = function(){
	$.getJSON( 'https://script.google.com/macros/s/AKfycbyFeS9ghi4Cj44eguhffRmT1bqHrI94mYLA3pS6fjXpW5YokJq7GIAojYCp-VIaBKic/exec?action=getGuestBook&vc1ycvwbf6zuqyn1cf=true' ).done((response) => {
		$("#table-loader").addClass("d-none");
		if(response.statusCode == 1){
			$("#guestbooks-datalist").html("");
			// split into lines
			let rows = response.data.split("\n");
			// parse lines
			rownum = 0;
			rows.forEach( function getvalues(ourrow) {
				//Skip header
				if(rownum>0){
					guestbookrows = $("<tr>");

					// split line into columns
					let columns = ourrow.split(",");
					
					$.each(columns, function( index, value ) {
						guestbookrows.append(`<td>${value}</td>'`);
					});
					
					$("#guestbooks-datalist").append(guestbookrows);
				}
				rownum++;
			});
		}else{
			$("#guestbooks-datalist").append(response.statusText);
		}
	});
}

const googleCredentialsSignout = function(){
	google.accounts.id.disableAutoSelect();
	delete localStorage.googleCredentials;
	
	location.reload();
}