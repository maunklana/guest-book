$(function() {
	google.accounts.id.initialize({
		client_id: "12760851327-a1i1d9s9gjg3d8fnvj0t2hken7gpter1.apps.googleusercontent.com",
		callback: handleGoogleCredentialResponse
	});
});