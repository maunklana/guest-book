function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

const appendscript = function(url, method = ''){
	let s = document.createElement('script');
	s.src = url;
	if(['defer', 'async'].indexOf(method) >= 0){
		s[method] = true;
	}
	document.body.appendChild(s);
	return s;
}

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
		
		$(function() {
			$("#addguestbookmanual").submit(function(e){
				e.preventDefault();
				
				decodeGoogleCredential = parseJwt(googleCredentials);
				
				var $requestSettings = {
					"url": `https://script.google.com/macros/s/AKfycbyFeS9ghi4Cj44eguhffRmT1bqHrI94mYLA3pS6fjXpW5YokJq7GIAojYCp-VIaBKic/exec?action=insertGuestToBook&loggedinemail=${decodeGoogleCredential.email}`,
					"method": "POST",
					"timeout": 0,
					"headers": {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					"redirect": "follow",
					"data": $("#addguestbookmanual").serialize()
				};
				
				$("#addguestbookmanual :input").prop("disabled", true); 
				
				$.ajax($requestSettings).done((response) => {
					$("#addguestbookmanual :input").prop("disabled", false);
					infoicon = 'error';
					infoiconcolor = '';
					if(response.statusCode == 1){
						infoicon = 'success';
						infoiconcolor = '#991188';
						$("#addguestbookmanual")[0].reset();
					}
					if(typeof response.statusText !== 'undefined'){
						infotext = response.statusText;
						attendernum = response.guestNumber;
					}
					Swal.fire({
						icon: infoicon,
						iconColor: infoiconcolor,
						title: '',
						html: (response.statusCode == 1) ? `<i class="bi bi-check-circle"></i> ${attendernum} - ${infotext}` : infotext,
						confirmButtonColor: '#991188'
					}).then((result) => {
						if(response.statusCode == 1){
							Fancybox.close();
						}
					});
				});
			});
			
			appendscript('//asepnabila.link/qrcode-reader/dist/js/qrcode-reader.min.js', 'defer').onload = () => {
				$.qrCodeReader.jsQRpath = "//asepnabila.link/qrcode-reader/dist/js/jsQR/jsQR.min.js";
				$.qrCodeReader.beepPath = "//asepnabila.link/sound/meizu_barcode_recognize.ogg";
				
				$("#scan-guestbooks").qrCodeReader({
					qrcodeRegexp: /{"A":"[\w ,'.]{1,}","D":".{5,}","K":"\d","V":"\w{10,}"}/,
					audioFeedback: true,
					callback: function(code) {
						Swal.fire({
							html: '<div class="container-fluid text-center" style="overflow: hidden;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>',
							width: '100%',
							height: '100%',
							background: 'transparent',
							showConfirmButton: false,
							showCloseButton: false,
							showCancelButton: false,
							allowOutsideClick: false,
							allowEscapeKey: false,
							allowEnterKey: false,
						})
						decodeGoogleCredential = parseJwt(googleCredentials);
						qrcodeParams = JSON.parse(code);
						submitQRurl = `https://script.google.com/macros/s/AKfycbyFeS9ghi4Cj44eguhffRmT1bqHrI94mYLA3pS6fjXpW5YokJq7GIAojYCp-VIaBKic/exec?action=insertGuestToBook&vc1ycvwbf6zuqyn1cf=true&loggedinemail=${decodeGoogleCredential.email}`;
						
						var settings = {
						  "url": submitQRurl,
						  "method": "POST",
						  "timeout": 0,
						  "headers": {
							"Content-Type": "application/x-www-form-urlencoded"
						  },
						  "data": {
							"guestname": qrcodeParams.A,
							"guestdomicile": qrcodeParams.D,
							"guestcolleague": qrcodeParams.K,
							"visitorid": qrcodeParams.V,
							"insertmethod": "Scanned"
						  }
						};

						$.ajax(settings).done(function (rsp) {
							if(rsp.statusCode == 1){
								scannedIcon = 'bi-check-circle';
								if(rsp.exclusive == 1){
									scannedIcon = 'bi-patch-check';
								}
								attendernum = response.guestNumber;
								Swal.fire({
									icon: 'success',
									iconColor: '#991188',
									title: '',
									html: `<i class="bi ${scannedIcon}"></i> ${attendernum} - Berhasil mengisi buku tamu`,
									confirmButtonColor: '#991188'
								});
							}else{
								Swal.fire({
									icon: 'error',
									title: 'Oops...',
									text: rsp.statusText,
									confirmButtonColor: '#991188'
								});
							}
						});
					}
				});
			}
		});
	}
}

let currentGuestNum = 0;
const loadGuestBooks = function(){
	$.getJSON( 'https://script.google.com/macros/s/AKfycbyFeS9ghi4Cj44eguhffRmT1bqHrI94mYLA3pS6fjXpW5YokJq7GIAojYCp-VIaBKic/exec?action=getGuestBook&vc1ycvwbf6zuqyn1cf=true' ).done((response) => {
		$("#table-loader").addClass("d-none");
		if(response.statusCode == 1){
			// split into lines
			let rows = response.data,
			totalrow = rows.length;
			if(currentGuestNum<rows.length){
				$("#guestbooks-datalist").html("");
				rownum = 0;
				let rows = response.data;
				$.each( rows, function( k, v ) {
					console.log(v);
					if(rownum>0){
						guestbookrows = $(`<tr id="guest${rownum}">`);
						$.each( v.slice(0, 5), function( ky, vl ) {
							console.log(vl);
							if(ky == 1){
								xdatetime = new Date(Date.parse(vl));
								vl = ('0' + xdatetime.getHours()).slice(-2) + ':' + ('0' + xdatetime.getMinutes()).slice(-2) + ':' + ('0' + xdatetime.getSeconds()).slice(-2) ;
							}
							if(ky == 4){
								colegueof = [
									' - ',
									'mempelai pria',
									'mempelai wanita',
									'orang tua mempelai pria',
									'orang tua mempelai wanita'
								];
								vl = colegueof[vl];
							}
							guestbookrows.append(`<td>${vl}</td>'`);
						});
						
						$("#guestbooks-datalist").append(guestbookrows);
						
						if(rownum>=totalrow-1){
							$('#guestbooks-table-col')[0].scrollTop = 0;
							$('#guestbooks-table-col').animate({
								scrollTop: $(`#guest${rownum}`).offset().top+50
							}, 500);
						}
					}
					
					rownum++;
				});
				currentGuestNum = totalrow;
			}
			
			setTimeout(loadGuestBooks, 1000);
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