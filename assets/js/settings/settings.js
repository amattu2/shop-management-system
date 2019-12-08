$(document).ready(function() {
	// Setup Document
	fetchUsers();
	fetchAttemptiveLogins();
	
	// Fetch Users
	function fetchUsers() {
	$.post("assets/php/adminHook.php", { function: 'fetchAllUsers' }, function(data) { 
		$('#userList').children().remove();	
		
		// Loop Through Users
		users = JSON.parse(data);
		for (var i = 0; i < users.length; i++) {
			var user = users[i];	
			
			// Build div
			var user_S = $("<div class='user' data-id='"+ user.id +"'> <div class='image'><img src='http://via.placeholder.com/50x50' /></div> <span class='username'>@"+ user.username +"</span><span class='name'>"+ user.name +"</span></div>");
			var user_A = $("<div class='user admin' data-id='"+ user.id +"'> <div class='image'><img src='http://via.placeholder.com/50x50' /></div> <span class='username'>@"+ user.username +"</span><span class='name'>"+ user.name +"</span></div>");
			var usero = $("<div class='options'></div>");
			
			// Options
			var optionView = $("<span class='option viewUser'>View</span>").click(function() { fetchUserByID($(this).parent().parent().data('id')); });
			var optionVerify = $("<span class='option'>Activate</span>").click(function() { activateUser($(this).parent().parent().data('id')); });
			var optionDeactivate = $("<span class='option'>Deactivate</span>").click(function() { deactivateUser($(this).parent().parent().data('id')); });
			var separator = $("<span> | </span>");
			
			// Append User
			if (user.verified == '1') {
				if (user.AuthLevel == '2') {
					$('#userList').append(user_A.append(usero.append(optionView)));
				} else {
					$('#userList').append(user_S.append(usero.append(optionView).append(separator).append(optionDeactivate)));
				}
			} else {
				if (user.AuthLevel == '2') {
					$('#userList').append(user_S.append(usero.append(optionView).append(separator).append(optionVerify)));
				} else {			
					$('#userList').append(user_S.append(usero.append(optionView).append(separator).append(optionVerify)));
				}
			}
		}
	});
	}
	
	// Fetch Attemptive Logins 
	function fetchAttemptiveLogins() {
	$.post("assets/php/adminHook.php", { function: 'fetchAttemptiveLogins' }, function(data) { 
		$('#attemptedLogins').children().remove();	
		
		// Loop Through Users
		attempts = JSON.parse(data);
		for (var i = 0; i < attempts.length; i++) {
			var attempt = attempts[i];
			var id = ['ipLocation-' + i];
			
			$("#attemptedLogins").append("<div class='login'><span class='count'>#"+ attempt.Attempts +"</span> <span id='"+ id +"'></span> <div class='bottom-case'><span>"+ attempt.Username +"</span><span>"+ attempt.IP +"</span></div></div>");	
			
			//setTimeout(function() {  $.get("https://ipapi.co/"+ attempt.IP +"/json/", function(data){ $("'"+ idHash +"'").text(data.city); }); }, 400 * i);
		}
	});	
	}
	
	// Create User Function
	$('#form-submit').click(function() {
		var user = {name: $("#form-name").val(), username: $("#form-username").val(), password: $("#form-password").val(), email: $("#form-email").val(), initials:  $("#form-initials").val()};
		$.post("assets/php/adminHook.php", { function: 'createUser', searchArg: JSON.stringify(user) }, function(data) { 
			fetchUsers();
		});
	});
	
	// Activate User
	function activateUser(id) {
		$.post("assets/php/adminHook.php", { function: 'activateUser', searchArg: id }, function(data) { 
			fetchUsers();
		});		
	}
	
	// Deactivate User
	function deactivateUser(id) {
		$.post("assets/php/adminHook.php", { function: 'deactivateUser', searchArg: id }, function(data) { 
			fetchUsers();
		});			
	}
	
	// Fetch User
	function fetchUserByID(name) {
		$.post("assets/php/adminHook.php", { function: 'fetchUserByID', searchArg: name }, function(data) { 
			console.log(data);
		});		
	}
});