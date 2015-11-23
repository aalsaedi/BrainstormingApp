var changed = false;

$('#change').click(function() {
	$('#label').html($('#field').val());
	changed = true
});

function poll() {
	$.ajax({
		type: 'POST',
		url: '/pollRoom',
		data: pollData(),
		dataType: 'json', 
		timeout: 2000,
		success: function(update) {
			console.log(update);
			//codes: -1: error - 0: no changes - 1: changes on server, no changes on client - 2: changes on client, no changes on server - 3 
			switch (update.code) {
				case -1: case 0: break;
				case 1: case 3:
					$('#label').html(update.text);
				case 2:
					vars.version = update.version;
					break;
			}
		},
		complete: function() {
			setTimeout(poll,2000);
		}
	});
}

function pollData() {
	var data = {
		id: vars.id,
		version: vars.version,
		user: 'todo'
	}

	if (!changed) {
		data.changed = false;
	}
	else {
		changed = false;
		data.changed = true;
		data.text = $('#field').val();
	}

	return data;
}

$(document).ready(function() {
	poll();
});