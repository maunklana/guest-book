$(function() {
	google.accounts.id.initialize({
		client_id: "12760851327-a1i1d9s9gjg3d8fnvj0t2hken7gpter1.apps.googleusercontent.com",
		callback: handleGoogleCredentialResponse
	});
	
	if(typeof googleCredentials == 'undefined' || googleCredentials == ''){
		swallLoginPrompt();
	}else{
		showGuestBooks();
	}
	
	$("#loggedin-signout").click(function(e){
		e.preventDefault();
		Swal.fire({
		title: 'Kamu yakin ingin logout?',
			showCancelButton: true,
			confirmButtonText: 'Ya, logout',
			cancelButtonText: 'Tidak',
			reverseButtons: true
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				googleCredentialsSignout();
			}
		});
		
	});
});