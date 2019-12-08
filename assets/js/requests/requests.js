$(document).ready(function() {
	$.post("hook.php", { function: 'getOpenRequests' }, function(data) { 
		data = JSON.parse(data);
		for(var i = 0; i < data.length; i++) {
			var obj = data[i];
			var subDate = moment(obj.Date, "YYYY-MM-DD HH:mm:SS");
			$('.requests').append("<div class='request'><div class='date'><span>"+ subDate.format("M/D") +"</span></div><div class='name'>"+ obj.Name +"</div><div class='requestNum'>Request: #"+ obj.ID +"</div><div class='requestVehicle'>Vehicle: "+ obj.Year + " " + obj.Make +"</div><div class='email'><a target='_new' href='mailto:"+ obj.Email +"'>"+ obj.Email +"</a></div></div>");
		}
	});	
});
