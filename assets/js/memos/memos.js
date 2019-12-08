$(document).ready(function() {
	$.post("hook.php", { function: 'getAllMemos' }, function(data) { 
		data = JSON.parse(data);
		for(var i = 0; i < data.length; i++) {
			var obj = data[i];
			$('.memos').append("<div class='memo'><div class='title'>Attn: "+ obj.attn +"</span></div><div class='text'>"+ obj.message +"</div><div class='author'><span>-</span> "+ obj.author +"</span></div></div>");
		}
	});
	
	$('#createMemo').click(function() {
		// Modal Vars
		var modal = $('.modal');
		var modalContent = $('.modal .modal-content');
		
		// Show Modal
		$(modal).show();
		
		// Prevent Pre-Detonation
		setTimeout(function(){ $(window).click(function() { if (!$(modalContent).is(event.target) && $(modalContent).has(event.target).length === 0) { $(modal).hide(); $(window).off('click'); } }); }, 550);
	});
});