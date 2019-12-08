$(document).ready(function() {
	$.post("hook.php", { function: 'getAllFiles' }, function(data) { 
		data = JSON.parse(data);
		for(var i = 0; i < data.length; i++) {
			var obj = data[i];
			$('.files').append("<div class='file'><div class='size'>file size: "+ numeral(obj.size).format('0.0b') +"</div><div class='download' onclick='downloadFile.call(this,event)' data-url='"+ obj.url +"'><i class='fa fa-cloud-download' aria-hidden='true'></i></div><div class='name'>"+ obj.name +"</div><div class='uploadDate'>Uploaded "+ obj.date +"</div></div>");
		}
	});	
	
	$('#uploadFile').click(function() {
		// Modal Vars
		var modal = $('.modal');
		var modalContent = $('.modal .modal-content');
		
		// Show Modal
		$(modal).show();
		
		// Prevent Pre-Detonation
		setTimeout(function(){ $(window).click(function() { if (!$(modalContent).is(event.target) && $(modalContent).has(event.target).length === 0) { $(modal).hide(); $(window).off('click'); } }); }, 550);
	});	
});

function downloadFile(event) {
	window.open(event.target.getAttribute('data-url'), '_blank');			
}