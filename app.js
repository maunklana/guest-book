$(function() {
	$.getJSON( 'https://script.google.com/macros/s/AKfycbyFeS9ghi4Cj44eguhffRmT1bqHrI94mYLA3pS6fjXpW5YokJq7GIAojYCp-VIaBKic/exec?action=getGuestBook&vc1ycvwbf6zuqyn1cf=true' ).done((response) => {
		$("#table-loader").addClass("d-none");
		if(response.statusCode == 1){
			$("#guestbooks-datalist").html("");
			
			// split into lines
			var rows = response.data.split("\n");

			// parse lines
			rownum = 0;
			rows.forEach( function getvalues(ourrow) {
				console.log(ourrow);
				
				//Skip header
				if(rownum>0){
					guestbookrows = $("<tr>");

					// split line into columns
					var columns = ourrow.split(",");
					
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
});