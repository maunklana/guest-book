$(function() {
	if(typeof kepada == 'undefined' && typeof group == 'undefined'){
		swallAskLogin();
	}else{
		showGuestBooks();
	}
});