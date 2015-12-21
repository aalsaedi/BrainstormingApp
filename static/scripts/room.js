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
		timeout: 1000,
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
			setTimeout(poll,1000);
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
		data.username = $('#shout_username').val();
		data.message = $('#shout_message').val();
		var dNow = new Date();
		var localdate= (dNow.getMonth()+1) + '/' + dNow.getDate() + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();
		data.date = localdate;
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

	var message = '<div class="shout_msg"><time>'+update.date+'</time><span class="username">'+update.username+'</span><span class="message">'+update.message+'</span></div>';
	$(message).hide().appendTo('.message_box').fadeIn();
	
	//keep scrolled to bottom of chat!
	var scrolltoh = $('.message_box')[0].scrollHeight;
	$('.message_box').scrollTop(scrolltoh);
}

$(document).ready(function() {
	updatePage(vars);
		//method to trigger when user hits enter key
	$("#shout_message").keypress(function(evt) {
		if(evt.which == 13) {
			var iusername = $('#shout_username').val();
			var imessage = $('#shout_message').val();
			var dNow = new Date();
			var localdate= (dNow.getMonth()+1) + '/' + dNow.getDate() + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();
			var message = '<div class="shout_msg"><time>'+localdate+'</time><span class="username">'+iusername+'</span><span class="message">'+imessage+'</span></div>';
			$(message).hide().appendTo('.message_box').fadeIn();
			
			//keep scrolled to bottom of chat!
			var scrolltoh = $('.message_box')[0].scrollHeight;
			$('.message_box').scrollTop(scrolltoh);
							
			changed = true;
		}
	});
	poll();
	
	//reset value of message box
	$('#shout_message').val('');
	// //toggle hide/show shout box
	// $(".close_btn").click(function (e) {
	// 	//get CSS display state of .toggle_chat element
	// 	var toggleState = $('.toggle_chat').css('display');
		
	// 	//toggle show/hide chat box
	// 	$('.toggle_chat').slideToggle();
		
	// 	//use toggleState var to change close/open icon image
	// 	if(toggleState == 'block')
	// 	{
	// 		$(".header div").attr('class', 'open_btn');
	// 	}else{
	// 		$(".header div").attr('class', 'close_btn');
	// 	}
	// }
});