$(document).ready(function() {
/*********************************************************************/
/*								     */
/*			    Click Handler		             */
/*								     */
/*********************************************************************/	
$('.option').click(function() {
	// Update Classes
	$('.option.active').removeClass('active');
	$('.item.active').removeClass('active');
	$(this).addClass('active');
	$($(this).data('target')).addClass('active');
});

/*********************************************************************/
/*								     */
/*			    Personal Memos		             */
/*								     */
/*********************************************************************/	
// Load Memo
var textarea = $('#notes textarea');
$.post("hook.php", { function: 'getPersonalNotes' }, function(data) { 
	try {
		data = JSON.parse(data);
		$(textarea).val(data.memo);
	} catch(e) {}	
});

// Handle Length
$(textarea).on('keyup', function(e) {
	if ($(this).val().length > 1024) {
		$(this).css({color: 'red'}).val($(this).val().substr(0, 1024));
		setTimeout(function() { $(textarea).css({color: '#222'}) }, 200);
	}
});
/*********************************************************************/
/*								     */
/*			    Verbal Quotes		             */
/*								     */
/*********************************************************************/	
// Load Verbal quotes

/*********************************************************************/
/*								     */
/*			    Memo Section		             */
/*								     */
/*********************************************************************/	
// Load Memos
$.post("hook.php", { function: 'getAllMemos' }, function(data) { 
	try {
		data = JSON.parse(data); 
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			var exp = moment(obj.Expires, "YYYY-MM-DD HH:mm:ss").diff(moment(), "days");
			if (exp < 1) {
				expiration = "in less than 1 day";
			} else {
				expiration = "in "+ exp +" days";
			}
			$('#memos').append("<div class='memo'><div class='title'>Attn: "+ obj.attn +"</span></div><div class='text'>"+ obj.message +"</div><div class='author'><span>-</span> "+ obj.author +"</span></div><div class='expiration'> Expires "+ expiration +"</div>");
		}
	} catch(e) { return false; }
});

$('#createMemo').click(function() {
	// Modal Vars
	var modal = $('.modal');
	var modalContent = $('.modal .modal-content');
	
	// Show Modal
	$(modal).show();

	// Create Memo
	$('#submit').click(function() {
		var memo = {attn: $('#attn').val(), message: $('#message').val(), expiration: $('#expiration').val() };
		$.post("hook.php", { function: 'createMemo', searchArg: JSON.stringify(memo) }, function(data) { 
			try { 
				data = JSON.parse(data); 
				if (data.status == 1) {
					$(modal).hide();
					$(window).off('click');				
				} else { console.log(data) }
			} catch(e) { return false; }
		});		
	});
	
	// Prevent Pre-Detonation
	setTimeout(function(){ $(window).click(function() { if (!$(modalContent).is(event.target) && $(modalContent).has(event.target).length === 0) { $(modal).hide(); $(window).off('click'); } }); }, 550);
});

/*********************************************************************/
/*								     */
/*			     User Logging Sect.		             */
/*								     */
/*********************************************************************/	
// Load Logs
$.post("hook.php", { function: 'getAllLogs' }, function(data) { 
	try {
		data = JSON.parse(data); 
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			$('#logs').prepend("<div class='log'><span class='id'>"+ obj.id +"</span><span class='action'>"+ obj.Action +"</span><span class='desc'>"+ obj.UserName +" updated "+ obj.Column +" (#"+ obj.CusID +")</span></div>");
		}
	} catch(e) { return false; }
});
});