$(document).ready(function() {
	// Load All Database Data
	var c_Obj = $('#current-objective');
	
	// Customers
	fetchCustomers();	
	function fetchCustomers() {
		if (Lockr.get('customers') == undefined) {
			$('#loader-case').css({display: 'flex'});
			$(c_Obj).text("..Downloading customers");
			$.post("hook.php", { function: 'getAllCustomerNames' }, function(data) { 
				// Build Array
				var customerList = Array();
				var data = JSON.parse(data)
				for (var i = 0; i < data.length; i++) {
					var obj = data[i];
					customerList.push({CusID: obj.CusID, name: obj.CusFirstName + " " + obj.CusLastName});	
				}			
				Lockr.set('customers', customerList);
				setTimeout(function() { fetchPackages() }, 450);
			});
		} else { fetchPackages(); }	
	}
	
	// Appointments
	function fetchPackages() {
		if (Lockr.get('invoicePackages') == undefined) {
			$(c_Obj).text("..Downloading packages");
			$.post("hook.php", { function: 'getAllPackages' }, function(data) { 	
				// Push Array, Next
				Lockr.set('invoicePackages', JSON.parse(data));	
				setTimeout(function() { fetchServices() }, 450);
			});
		} else { fetchServices(); }
	}
	
	// Service 
	function fetchServices() {
		if (Lockr.get('appServices') == undefined) {
			$(c_Obj).text("..Downloading schedule services");
			$.post("hook.php", { function: 'getAllScheduleServices' }, function(data) { 
				// Push Array, Next
				Lockr.set('appServices', JSON.parse(data));
				setTimeout(function() { fetchInvoices() }, 450);
			});
		} else { fetchInvoices(); }
	}
	
	// Invoices
	function fetchInvoices() {
		if (Lockr.get('recentInvoices') == undefined) {
			$(c_Obj).text("..Downloading recent invoices");
			$.post("hook.php", { function: 'getOpenInvoices' }, function(data) { 
				// Push Array, Next
				Lockr.set('recentInvoices', JSON.parse(data));
				setTimeout(function() { fetchStats() }, 450);
			});				
		} else { fetchStats(); }	
	}
	
	// Stats
	function fetchStats() {
		if (Lockr.get('userStats') == undefined) {
			$(c_Obj).text("..Downloading your stats");
			var userStats = {};
			// Appointments
			$.post("hook.php", { function: 'getUserScheduledAppts' }, function(data) { 
				// Push Array
				userStats["Appointments"] = JSON.parse(data);
				// Invoices
				$.post("hook.php", { function: 'getUserCreatedInvoices' }, function(data) { 
					// Push Array, Next
					userStats["Invoices"] = JSON.parse(data);	
					setTimeout(function() { $('#loader-case').hide(); Lockr.set('userStats', userStats); updatePage(); }, 350);		
				});					
			});	
		} else { setTimeout(function() {$('#loader-case').hide(); updatePage(); }, 1150); }
	}
	
	/*******************************/
	function updatePage() {
		// Update Stats
		try { $('#customersBooked').html(Lockr.get('userStats')["Appointments"].length); } catch(e) {}
		try { $('#invoicesCreated').html(Lockr.get('userStats')["Invoices"].length); } catch(e) {}
		var estEarnings = 0;
		try { for (var i = 0; i < Lockr.get('userStats')["Invoices"].length; i++) { estEarnings += parseInt(Lockr.get('userStats')["Invoices"][i].Total); } } catch(e) { }
		$('#estimatedEarnings').html(numeral(estEarnings, "0,0.00").format("$0,0.00"));
		// Update Appointments / Invoices
		try { 
			var appointments = Lockr.get('userStats')["Appointments"];
			for (i = 0; i < appointments.length; i++) {
				$('.feed').append("<div class='feed-item'><span class='date'>"+ moment(appointments[i].AppDate, "MM/DD/YY").format("M/D") +"</span><span class='desc'>"+ appointments[i].AppCusName +"</span><span class='feed-type'>App</span></div>");
			} 
			var invoices = Lockr.get('userStats')["Invoices"];
			for (i = 0; i < invoices.length; i++) {
				$('.feed').append("<div class='feed-item'><span class='date'>"+ moment(invoices[i].EstDate, "MM/DD/YYYY HH:mm").format("M/D") +"</span><span class='desc'>"+ invoices[i].LastName +"</span><span class='feed-type'>Invoice</span></div>");
			} 			
		} catch(e) {}
	}
});