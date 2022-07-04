$(function() {
	if(typeof googleCredentials == 'undefined' && typeof googleCredentials == 'undefined'){
		swallAskLogin();
	}else{
		showGuestBooks();
	}
});