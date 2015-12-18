var changed = false;
var canvas = new fabric.Canvas('canvas');
canvas.isDrawingMode = true;

$('#update').click(function() {
	$('#label').html($('#field').val());
	changed = true
});

$('#modeDrawing').click(function() {
	if (canvas.isDrawingMode) {
		canvas.isDrawingMode = false;
		$('#modeDrawing').html('Selection Mode');
	}
	else {
		canvas.isDrawingMode = true;
		$('#modeDrawing').html('Drawing Mode');
	}
});

function poll() {
	$.ajax({
		type: 'POST',
		dataType: 'json', 
		url: '/pollRoom',
		data: pollData(),
		timeout: 2000,
		success: function(update) {
			//codes: -1: error - 0: no changes - 1: changes on server - 2: changes on client - 3: changes on server and client
			switch (update.code) {
				case -1: case 0: break;
				case 1: case 3:
					updatePage(update);
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

	if (changed) {
		changed = false;
		data.changed = true;
		data.text = $('#field').val();
		data.canvas = JSON.stringify(canvas);
	}
	else {
		data.changed = false;
	}

	return data;
}

function updatePage(update) {
	$('#label').html(update.text);
	canvas.loadFromJSON(update.canvas);
	canvas.renderAll();
}

$(document).ready(function() {
	updatePage(vars);
	poll();
});