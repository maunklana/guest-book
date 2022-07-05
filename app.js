$(function() {
	if(typeof googleCredentials == 'undefined' || googleCredentials == ''){
		swallAskLogin();
	}else{
		showGuestBooks();
	}
});