function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

const swallAskLogin = function(functiontoCall){
	Swal.fire({
		html: '<div class="text-light pb-2"><h1><i class="bi bi-person-bounding-box"></i></h1>Kamu harus login untuk mengakses halaman ini!</div><div id="googleLoginButton" data-login_uri="https://maunklana.github.io/guest-book/"></div>',
		width: "auto",
		color: "white",
		showCancelButton: false,
		confirmButtonText: 'Lanjut',
		confirmButtonColor: '#991188', //Warna kesukaan Nabila
		background: 'transparent',
		backdrop: `
		linear-gradient(rgba(255, 255, 255, 0.5), rgba(100, 100, 100, 1))
		`,
		allowOutsideClick: false,
		allowEscapeKey: false,
		showConfirmButton: false,
		didOpen: () => {
			google.accounts.id.initialize({
				client_id: "12760851327-a1i1d9s9gjg3d8fnvj0t2hken7gpter1.apps.googleusercontent.com",
				callback: handleCredentialResponse
			});
			google.accounts.id.renderButton(
				document.getElementById("googleLoginButton"),
				{ theme: "outline", size: "large" }  // customization attributes
			);
			google.accounts.id.prompt(); // also display the One Tap dialog
		}
	}).then((result) => {
		showGuestBooks();
	});
}

function handleCredentialResponse(response) {
	console.log("Encoded JWT ID token: " + response.credential);	
	localStorage.googleCredentials = response.credential;
	showGuestBooks();
}

const showGuestBooks = function(){
	googleCredentials = localStorage.googleCredentials;
	
	const responsePayload = parseJwt(googleCredentials);
	console.log("ID: " + responsePayload.sub);
	console.log('Full Name: ' + responsePayload.name);
	console.log('Given Name: ' + responsePayload.given_name);
	console.log('Family Name: ' + responsePayload.family_name);
	console.log("Image URL: " + responsePayload.picture);
	console.log("Email: " + responsePayload.email);
	
	Swal.close();
	
	$('.xhidden').each(function() {
		$(this).addClass('animate__animated animate__slideInUp');
		$(this).css('visibility', 'visible');
	});
	
	loadGuestBooks();
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