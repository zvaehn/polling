function add_list_item() {
	$('#answer-list').children('li').each(function(index) {
		var input = $(this).children('input');
		input.unbind();

		if($(this).is(':last-child')) {
			input.keydown(function(index) {
				if($(this).val() != "") {
					$('#answer-list').append("<li><input type='text' name='answers[]'></li>");
					add_list_item();
				}
			});
		}
	});
}

$(document).ready(function($) {
	add_list_item();

	$('#answer-list').sortable();
	$('#answer-list').disableSelection();
});
