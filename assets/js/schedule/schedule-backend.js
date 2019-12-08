$(document).ready(function() {
	// Test Crap
	var headers = ["GG", "MGMT", "GL", "ETC"];
	var hours = ["7:00", "16:00"];
	var lunch = ["12:00", "13:00"];
	$("#schedule-case").build({headers: headers, hours: hours, off: lunch});
});

(function ($) {
	$.fn.extend({
		build: function(options) {
			/***************|***************/
			/*           Defaults          */
			/***************|***************/
			var defaults = {
				headers: ["1", "2", "3", "4"], /* Employees, etc */
				hours: ["7:00", "16:00"], /* Operation Hours */
				off: ["12:00", "13:00"], /* Lunch Break */
				hourInterval: "4", /* Max = 6 */
				show24Time: "false" /* Show 24 Clock or 12hr */
			};


			/***************|***************/
			/*          Variables          */
			/***************|***************/
			// Connect Options/Arguments
			options = $.extend(defaults, options);
			// Schedule Case
			scheduleCase = $(this);
			// Columns
			var columns = options.headers.length;
			var columnID = 0;
			// Hour Int Time [60m / 4]
			var hour_int = 60 / options.hourInterval;


			/***************|***************/
			/*          FUNCTIONS          */
			/***************|***************/
			// Schedule Columns
			options.headers.forEach(function(header) {
				$(scheduleCase ).append("<div class='column' data-col='"+ columnID +"' style='width: calc(100% / "+ columns +")'><div class='columnHeader'>"+ header +"</div></div>");
				columnID++;
			});

			// Schedule Rows
			$('.column').each(function() {
				var Col = $(this);
				var s_Time = moment(options.hours[0], "HH").format("H"); var e_Time = moment(options.hours[1], "HH").format("H");
				var bStart_Time = moment(options.off[0], "HH:mm").format("H"); var bEnd_Time = moment(options.off[1], "HH:mm").format("H");
				for (var i = 0; i <= 24; i++){
					if (options.show24Time == 'true') { var i_Time = moment(i, "H").format("H:00"); } else { var i_Time = moment(i, "H").format("ha"); }
					// (Between Opening Hours & Closing Hours) && !(Between lunch Hours)
					if ((i >= s_Time) && (i <= e_Time) && !(i >= moment("12:00", "HH").format("H") && i <= moment("12:00", "HH").format("H"))) {
						$(this).append("<div class='row' data-col='"+ $(Col).data('col') +"' data-row='"+ i +"'><span class='rowTime'>"+ i_Time +"</span></div>");
					// (Between Lunch Hours)
					} else if ((i >= moment("12:00", "HH").format("H") && i <= moment("12:00", "HH").format("H"))) {
						$(this).append("<div class='row Disabled' data-col='"+ $(Col).data('col') +"' data-row='"+ i +"'><span class='rowTime'>"+ i_Time +"</span></div>");
					} else if ((i >= s_Time-1) && (i <= moment(options.hours[1], "HH").add(1, "H").format("H"))) {
						$(this).append("<div class='row Disabled' data-col='"+ $(Col).data('col') +"' data-row='"+ i +"'><span class='rowTime'>"+ i_Time +"</span></div>");
					}
				}
			});

			// Schedule Row Sections
			$('.row').each(function() {
				var Row = $(this);
				var Row_Time = $(this).data('row');
				for (var i = 0; i < options.hourInterval; i++) {
					if (i == 0) {
						$(Row).append("<div class='rowSection' data-time='"+ Row_Time +":00' data-sect='"+ i +"'></div>");
					} else {
						$(Row).append("<div class='rowSection' data-time='"+ Row_Time +":"+ hour_int*i +"' data-sect='"+ i +"'></div>");
					}
				}
			});

			// Detect Click
			$("#schedule-case").click(function(event) {
				// Is a Section, Is not a disabled row
				var target = $(event.target);
				if ($(target).hasClass('rowSection') && !$(target).parent().hasClass('Disabled')) {
					var targetParent = $(target).parent();
					bookAppointment($(targetParent ).data('col'), $(targetParent).data('col'), $(target).data('time'));
				}
			});

			// Detect Customer Cross Click
			var schedule_customer = getCookie("schedule_customer");
			var customerArray = Array();
			if (schedule_customer) {
				customerArray = JSON.parse(schedule_customer);
				// Notify Staff
				$('.notify-group').notify('info', '5000', 'Scheduling Customer: '+ customerArray.name);
				// Remove Cookie
				eraseCookie("schedule_customer");
			}

			// Handle Appointment Booking
			function bookAppointment(column, row, time) {
				// Variables
				var staff = options.headers[column];
				var time = moment(time, "H:mm");
				var date = "10/22/17";
				// Load Modal {Not Included, Default}
				$('#modal-loadInto').load("assets/html/scheduleBookModal.html", function() {
					// Divs
					var loadinto = $("#modal-loadInto");
					var modalCase = $("#modal-case");
					var modal = $("#modal");

					// Append Staff Options
					options.headers.forEach(function(header) {
						if (header == staff) {
							$("#modal #staff").append("<option selected value='"+ column +"'>"+ header +"</option>");
						} else {
							$("#modal #staff").append("<option value='"+ header +"'>"+ header +"</option>");
						}
					});

					// Append Service Options (From DB)
					$.post("hook.php", { function: 'getAllScheduleServices' }, function(data) {
						services = JSON.parse(data);
						for (var i = 0; i < services.length; i++) {
							var service = services[i];
							$("#service").append("<option data-timemin='"+ service.LengthMin +"' value='"+ service.id +"'>"+ service.Label +"</option>");
						}
						$('#service').on('change', function() { updateTimeLength($(this).find(':selected').data('timemin')); if ($('#service').val() == 3) { toggleImageUpload(1); } else { toggleImageUpload(0); } });
					});

					// Select Time
					$('#time').append("<option selected>"+ time.format("h:mm a") +"</option>");


					// Length Options [Calculate Closing time from the time selected, divided by hour interval (default 20)]
					var maxTimeLength = moment.duration(moment(options.hours[1], "HH:mm").add(1,'hour').diff(moment(time, "HH:mm"))).asMinutes() / hour_int;
					for (var i = 1; i <= maxTimeLength; i++) {
						var span = i * hour_int;
						var fromNow = moment(time, "HH:mm").add(span, "minutes").format("h:mm a");
						$("#lengthMin").append("<option value='"+ span +"'>"+ span +" min ("+ fromNow +")</span>");
					}

					// FUNCTIONS
					// Show Image Upload
					function toggleImageUpload(show) {
						if (show == 1) {
							$('.uploadBtn').css({display: 'block'});
							$(modal).animate({height: '430px'});
						} else {
							$('.uploadBtn').css({display: 'none'});
							$(modal).animate({height: '383px'});
						}
					}

					// Append Time Options
					function updateTimeLength(time) {
						$("#lengthMin").val(time);
					}

					// Assign Tab Clicks
					$('.tab').each(function() {
						$(this).click(function() {
							var tab = $(this);
							var target = $(this).data('target');
							// Remove Classes
							$('.tab.selected').removeClass('selected');
							$('.section.selected').animate({opacity: '0'}, 250, function() {
								$('.section.selected').removeClass('selected')
								$(tab).addClass('selected');
								$(target).css({opacity: 0}).addClass('selected');
								$(target).animate({opacity: '1'}, 250);
							});
						});
					});

					// Customer Search
					$("#CustomerSearchSubmit").on('click', function() {
						$.post("hook.php", { function: 'getCustomerByName', searchArg: $("#CustomerSearchInput").val() }, function(data) {
							customers = JSON.parse(data);
							$("#CustomerSearchResults").animate({scrollTop: '0'}).children().remove();
							if (customers !== null && customers.length >= 1) {
								for (var i = 0; i < customers.length; i++) {
									var customer = customers[i];
									$("#CustomerSearchResults").append("<div class='result'>"+ customer.CusFirstName +" "+ customer.CusLastName +"</div>");
								}
							} else {
								$("#CustomerSearchResults").append("<div class='result'>No results</div>");
							}
						});
					});

					// If Customer is pre-selected
					if (customerArray.length !== 0) {
						alert("User is pre-selected");
						console.log(customerArray);
					}

					// Show Modal
					$(modalCase).css({display: 'flex'});
					// Detect Click Off
					$(modalCase).click(function(event) {
						if (!$(modal).is(event.target) && $(modal).has(event.target).length === 0) {
							$(loadinto).children().remove();
						}
					});
					$(".buttons #cancel").click(function() { $(loadinto).children().remove(); });

				});
			}

			// Handle Appointment Database
			function createAppointment() {
				// AppCusID
				// AppDate [MM/DD/YY]
				// AppTimeBegin [H:mm A]
				// AppTimeLengthMin [30]
				// AppStatus [Confirmed]
				// AppServiceLabel [Loaded from the selected service]
				// AppProviderID [0, 1, 2, 3]
				// AppServiceID [Loaded from the selected service]
				// AppScheduledBy [Loaded from logged in user]
				// AppVehicleID [Selected from search]
				// AppReminder [0/1]
				// AppCusName [Loaded from search]

			}
		}
	});
}(jQuery));
