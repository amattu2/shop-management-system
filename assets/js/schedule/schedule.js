// Variables
var headers = ["GG", "MGMT", "GL", "ETC"];
var hours = ["7:00", "16:00"];
var off = ["12:00", "13:00"];
var appointmentCount = 0;
var currentdate = moment().format("MM/DD/YY");

// Setup Page
$(document).ready(function() {
	// Reset Previous Timeout
	clearTimeout(checkApps);

	// Load Appointments
	function load(date = null) {
		if (!date) { date = currentdate; }
		$.post("hook.php", { function: 'getApptsByDate', searchArg: date}, function(data) {
			appointments = JSON.parse(data);
			currentdate = date;
			loadAppointments(appointments);
			$('#date-picker').datepicker('setDate', moment(currentdate, "MM/DD/YY").format("MM/DD/YYYY")).text(moment(currentdate, "MM/DD/YY").format("MMM Do, YYYY"));
			$('.loader-case').css({display: 'flex'});
		});
	}

	// Check Appointment Timeout
	var checkApps = setInterval(checkForUpdatedApps, 60000);

	// Check Appointments Function
	function checkForUpdatedApps() {
		var CheckAppArray = JSON.stringify({date: currentdate, currentLength: appointmentCount});
		$.post("hook.php", { function: 'checkForUpdatedApps', searchArg: CheckAppArray}, function(data) {
			if (parseInt(data) == 0) { load(); }
		});
	}

	// Date Selectors
	$('#today').click(function() {
		load(moment().format("MM/DD/YY"));
	});

	$('#next-day').click(function() {
		var next_date_moment = moment(currentdate, "MM/DD/YY").add(1, "day");
		if (next_date_moment.weekday() !== 0) {
			load(next_date_moment.format("MM/DD/YY"))
		} else {
			load(next_date_moment.add(1, "day").format("MM/DD/YY"))
		}
	});

	$('#date-picker').text(moment(currentdate, "MM/DD/YY").format("MMM Do, YY")).datepicker({
		startDate: "01/01/2017",
		format: 'M/D/YYYY',
		weekStart: 1,
		filter: function(date) {
			if (date.getDay() === 0) { return false; }
		},
		pick: function(date) {
			var cd_Formatted = moment(currentdate, "MM/DD/YY").format("MM/DD/YYYY");
			var sd_Formatted = moment($(this).datepicker('getDate', true), "M/D/YYYY").format("MM/DD/YYYY");
			if (cd_Formatted != sd_Formatted) {
				load(moment($(this).datepicker('getDate', true), "M/D/YYYY").format("MM/DD/YY"));
			}
		}
	}).on('pick.datepicker', function (e) { if (e.date < new Date()) {e.preventDefault()} });

	$('#previous-day').click(function() {
		var prev_date_moment = moment(currentdate, "MM/DD/YY").subtract(1, "day");
		if (prev_date_moment.weekday() !== 0) {
			load(prev_date_moment.format("MM/DD/YY"))
		} else {
			load(prev_date_moment.subtract(1, "day").format("MM/DD/YY"))
		}
	});

	// Build Schedule [On page load only]
	$("#schedule-case").build({headers: headers, hours: hours, off: off});

	// Load Appointments [On first load only, called separately when arrows are clicked]
	load();
});

// Schedule Build
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
			// Hour Int Time [60m / 4]
			var hour_int = 60 / options.hourInterval;

			/***************|***************/
			/*          FUNCTIONS          */
			/***************|***************/
			// Reset
			$(scheduleCase).empty();
			// Schedule Columns
			options.headers.forEach(function(header, i) {
				$(scheduleCase).append("<div class='column' id='col-"+i+"' data-col='"+ i +"' style='width: calc(100% / "+ columns +")'><div class='columnHeader'>"+ header +"</div></div>");
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
						var div = $("<div class='rowSection' data-time='"+ Row_Time +":00' data-sect='"+ i +"'></div>");
						$(Row).append(div);
					} else {
						var div = $("<div class='rowSection' data-time='"+ Row_Time +":"+ hour_int*i +"' data-sect='"+ i +"'></div>");
						$(Row).append(div);
					}
				}
			});

			// Schedule Book Click
			$("#schedule-case").click(function(e) {
				// Is a Section, Is not a disabled row
				var target = $(e.target);
				if ($(target).hasClass('rowSection') && !$(target).parent().hasClass('Disabled')) {
					var targetParent = $(target).parent();
					Appointment_Details.ServiceID = '';
					Appointment_Details.CusID = '';
					Appointment_Details.CarID = '';
					bookAppointment($(targetParent ).data('col'), $(targetParent).data('col'), $(target).data('time'));
				}
			});

			// Customer Selected From Customers
			var schedule_customer = getCookie("schedule_customer");
			var customerArray = Array();
			if (schedule_customer) {
				customerArray = JSON.parse(schedule_customer);
				$.alert({
					title: 'Customer Selected',
					content: 'Booking for customer ' + customerArray.name,
					type: 'green',
					autoClose: 'dismiss|5000',
					buttons: {
						cancel: function() { eraseCookie("schedule_customer"); },
						dismiss: { btnClass: 'btn-green' }
					},
					theme: 'material', boxWidth: '250px', backgroundDismiss: true, useBootstrap: false
				});
			}

			// Handle Appointment Booking
			var Appointment_Details = Array();
			function bookAppointment(column, row, time) {
				// Variables
				var staff = options.headers[column];
				var time = moment(time, "H:mm");
				var date = currentdate;

				// Update App Array
				Appointment_Details.Column = column;
				Appointment_Details.AppTimeBegin = time.format("HH:mm");
				Appointment_Details.date = date;

				// Load Modal {Not Included, Default}
				$('#modal-loadInto').load("assets/html/scheduleBookModal.html", function() {
					var loadinto = $("#modal-loadInto");
					var modalCase = $("#modal-case");
					var modal = $("#modal");

					// Append Staff Options
					options.headers.forEach(function(header, i) {
						if (header == staff) {
							$("#modal #staff").append("<option selected value='"+ i +"'>"+ header +"</option>");
						} else {
							$("#modal #staff").append("<option value='"+ i +"'>"+ header +"</option>");
						}
					});

					// Service Options
					if (Lockr.get('appServices') !== undefined) {
						// Append Service Options (From Storage)
						data = Lockr.get('appServices');
						for (var i = 0; i < data.length; i++) {
							var service = data[i];
							$("#service").append("<option data-timemin='"+ service.LengthMin +"' value='"+ service.id +"'>"+ service.Label +"</option>");
						}
						$('#service').on('change', function() { toggleBookButton(); Appointment_Details.ServiceID = $(this).val(); Appointment_Details.ServiceLabel = $(this).find(':selected').text(); updateTimeLength($(this).find(':selected').data('timemin')); if ($('#service').val() == 3) { toggleImageUpload(1); } else { toggleImageUpload(0); } });
					} else {
						// Append Service Options (From DB)
						$.post("hook.php", { function: 'getAllScheduleServices' }, function(data) {
							var appServiceList = Array();
							services = JSON.parse(data);
							for (var i = 0; i < services.length; i++) {
								var service = services[i];
								appServiceList.push(service);
								$("#service").append("<option data-timemin='"+ service.LengthMin +"' value='"+ service.id +"'>"+ service.Label +"</option>");
							}
							setTimeout(function() { Lockr.set('appServices', appServiceList); }, 650);
							$('#service').on('change', function() { toggleBookButton(); Appointment_Details.ServiceID = $(this).val(); Appointment_Details.ServiceLabel = $(this).find(':selected').text(); updateTimeLength($(this).find(':selected').data('timemin')); if ($('#service').val() == 3) { toggleImageUpload(1); } else { toggleImageUpload(0); } });
						});
					}


					// Select Time
					$('#time').append("<option selected>"+ time.format("h:mm a") +"</option>");

					// Select Staff
					$('#modal #staff').on('change', function() {
						Appointment_Details.Column = $(this).val();
					});

					// Select TimeLength
					$('#modal #lengthMin').on('change', function() {
						Appointment_Details.TimeLengthMin = $(this).val();
					});

					// Length Options [Calculate Closing time from the time selected, divided by hour interval (default 20)]
					// i = 2 (Skips the first two sets, Eg: 10m & 15m)
					var maxTimeLength = moment.duration(moment(options.hours[1], "HH:mm").add(1,'hour').diff(moment(time, "HH:mm"))).asMinutes() / hour_int;
					for (var i = 2; i <= maxTimeLength; i++) {
						var span = i * hour_int;
						var fromNow = moment(time, "HH:mm").add(span, "minutes").format("h:mm a");
						$("#lengthMin").append("<option value='"+ span +"'>"+ span +" min ("+ fromNow +")</span>");
					}

					// Show Image Upload
					function toggleImageUpload(show) {
						if (show == 1) {
							$(modal).animate({height: $(modal).height()+47 + "px"}, function() {
								$('.uploadBtn').css({display: 'block'});
							});
						} else {
							$('.uploadBtn').css({display: 'none'});
							$(modal).animate({height: "428px"});
						}
					}

					// Append Time Options
					function updateTimeLength(time) {
						$("#lengthMin").val(time);
						Appointment_Details.TimeLengthMin = time;
						toggleBookButton();
					}

					// Comment Field
					$('#comment').on('keyup', function() {
						Appointment_Details.AppNotes = $(this).val();
					});

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
					if (schedule_customer) {
						selectCustomer(customerArray.CusID, customerArray.CarID);
					} else {
						cusSearchSetup();
					}

					// Show Modal
					$(modalCase).css({display: 'flex'});
					// Detect Click Off
					$(modalCase).click(function(event) {
						if (!$(modal).is(event.target) && $(modal).has(event.target).length === 0) { $(loadinto).children().remove(); }
					});
					$(".buttons #cancel").click(function() { $(loadinto).children().remove(); });
				});
			}

			// Setup Customer Search Input
			function cusSearchSetup() {
				$("#CustomerSearchSubmit").on('click', function() {
					$("#CustomerSearchResults").animate({scrollTop: '0'}).children().remove();
					if (Lockr.get('customers') !== undefined) {
						customers = Lockr.get('customers');
						var results = [];
						for (var i = 0; i < customers.length; i++) {
							if (customers[i].name.indexOf($("#CustomerSearchInput").val()) > -1) {
								results.push(customers[i]);
							}
						}

						if (results.length >= 1) {
							for (var i = 0; i < results.length; i++) {
								customer = results[i];
								$("#CustomerSearchResults").append($("<div class='result' data-cusid='"+ customer.CusID +"'>"+ customer.name +"</div>").click(function() { selectCustomer($(this).data('cusid')); }));
							}
						} else {
								$("#CustomerSearchResults").append("<div class='result'>No results</div>");
						}
					} else {
						$.post("hook.php", { function: 'getCustomerByName', searchArg: $("#CustomerSearchInput").val() }, function(data) {
							customers = JSON.parse(data);
							if (customers !== null && customers.length >= 1) {
								for (var i = 0; i < customers.length; i++) {
									var customer = customers[i];
									$("#CustomerSearchResults").append($("<div class='result' data-cusid='"+ customer.CusID +"'>"+ customer.CusFirstName +" "+ customer.CusLastName +"</div>").click(function() { selectCustomer($(this).data('cusid')); }));
								}
							} else {
								$("#CustomerSearchResults").append("<div class='result'>No results</div>");
							}
						});
					}
				});
			}

			// Toggles Book Button
			function toggleBookButton() {
				// Invalid
				$("#continue").addClass("disabled").off('click');
				if (!Appointment_Details.CusID) { return false; }
				if (!Appointment_Details.TimeLengthMin) { return false; }
				if (!Appointment_Details.ServiceID) { return false; }
				if (Appointment_Details.CarID.length < 0) { return false; }
				// Valid
				$("#continue").removeClass("disabled").click(createAppointment);
			}

			// Select Customer
			function selectCustomer(CusID, CarID = null) {
				// Customer Info
				if (!CusID) { return false; }
				// Vehicle Info
				if (!CarID) { CarID = promptVehicle(CusID); return false; }
				// Everything Is Valid
				if (CarID && CusID) {
					// Get Customer Data
					$.post("hook.php", { function: 'getCustomerByID', searchArg: CusID}, function(data) {
						Appointment_Details.CusID = CusID;
						customer = JSON.parse(data)[0];
						// If Company
						if (customer.Company == 'True') {
							Appointment_Details.AppCusName = customer.CusLastName;
						} else {
							Appointment_Details.AppCusName = customer.CusFirstName + ' ' + customer.CusLastName;
						}

						// Get Vehicle Data
						if (CarID !== '0') {
							$.post("hook.php", { function: 'getVehicleByCarID', searchArg: CarID}, function(data) {
								vehicle = JSON.parse(data)[0];
								Appointment_Details.CarID = CarID;
								if (vehicle.CarDesc.trim().length > 4) {
									Appointment_Details.AppVehicleDesc = vehicle.CarDesc;
								} else {
									Appointment_Details.AppVehicleDesc = vehicle.ModYear +" "+ vehicle.Make +" "+ vehicle.Model;
								}
							});
						} else { Appointment_Details.CarID = 0; Appointment_Details.AppVehicleDesc = 'New Vehicle'; toggleBookButton(); }
						// Reminder Default
						Appointment_Details.AppReminder = 1;

						// Show Customer Selection
						$('.customer-search-group').hide();
						$('.customer-info').show();
						$('#customer-name').text(Appointment_Details.AppCusName);
						$('#appointment-vehicle').text(Appointment_Details.AppVehicleDesc);
						$('#customer-contact').on('keyup', function() {
							Appointment_Details.POC = $(this).val();
						});
						$('#customer-contact-num').on('keyup', function() {
							// Trim All But Numbers
							$(this).val($(this).val().replace(/[^0-9.]/g, "")).val($(this).val().substring(0,10));
							Appointment_Details.POCNum = $(this).val();
						});
						$('#send-reminder').on('change', function() {
							Appointment_Details.AppReminder = $(this).val();
						});

						// Deselect Customer
						$('#deselect-customer').click(function() {
							cusSearchSetup();
							$('.customer-search-group').show();
							$('.customer-info').hide();
							$("#continue").addClass("disabled").off('click');
							Appointment_Details.POC = '';
							Appointment_Details.POCNum = '';
						});

						// Book Button
						toggleBookButton();
					});
				} else {
					toggleBookButton();
				}
			}

			// Prompt User For Vehicle
			function promptVehicle(CusID) {
				$('#vehicle-prompt').load('assets/html/bookCustomerPopup.html', function() {
					setTimeout(function() {
					var ModalContainerChildren = $('#vehicle-prompt').children();
					var Modal = $('#bookCustomerModal');
					var ModalContent = $('#bookCustomerModal .modal-content');

					$.post("hook.php", { function: 'getAllVehiclesByCusID', searchArg: CusID}, function(data) {
						vehicles = JSON.parse(data);
						for (var i = 0; i < vehicles.length; i++) {
							var obj = vehicles[i];
							$("#customer-vehicle-select").append("<option value='"+ obj.CarId +"'>"+ obj.ModYear +" "+ obj.Make +" "+ obj.Model+"</option");
						}
					});

					$("#customer-vehicle-select").on('change', function() {
						if ($("#customer-vehicle-select").val() !== ' ' && $("#customer-vehicle-select").val() !== '') {
							$("#customer-book-continue").removeClass('disabled');
							$("#customer-book-continue").click(function() {
								selectCustomer(CusID, $("#customer-vehicle-select").val());
								$(ModalContainerChildren).remove();
								$(window).off('click');
							});
						} else {
							$("#customer-book-continue").addClass('disabled');
							$("#customer-book-continue").off('click');
						}
					});

					// Show/Hide Div
					$(Modal).show();
					$(window).click(function() {
						if (!$(ModalContent).is(event.target) && $(ModalContent).has(event.target).length === 0) { $(ModalContainerChildren).remove(); $(window).off('click'); }
					});
					}, 140);
				});
			}

			// Handle Appointment Creation
			function createAppointment() {
				// Appointment Build
				var appointment = {
					'AppCusID': Appointment_Details.CusID,
					'AppCusName': Appointment_Details.AppCusName,
					'AppPOC': Appointment_Details.POC,
					'AppPOCNum': Appointment_Details.POCNum,
					'AppDate': Appointment_Details.date,
					'AppTimeBegin': Appointment_Details.AppTimeBegin,
					'AppTimeLengthMin': Appointment_Details.TimeLengthMin,
					'AppStatus': 'booked',
					'AppServiceID': Appointment_Details.ServiceID,
					'AppServiceLabel': Appointment_Details.ServiceLabel,
					'AppNotes': Appointment_Details.AppNotes,
					'AppProviderID': Appointment_Details.Column,
					'AppVehicleID': Appointment_Details.CarID,
					'AppVehicleDesc': Appointment_Details.AppVehicleDesc,
					'AppReminder': Appointment_Details.AppReminder
				};

				$.post("hook.php", { function: 'createAppt', searchArg: JSON.stringify(appointment)}, function(data) {
					data = JSON.parse(data);
					if (data.status == 0) {
						$.alert({
							title: 'Booking Error',
							content: 'While booking the customer an error occured and returned: ' + data.message,
							type: 'red',
							autoClose: 'close|15000',
							buttons: {
								close: { btnClass: 'btn-red' }
							},
							theme: 'material', boxWidth: '250px', backgroundDismiss: true, useBootstrap: false
						});
					} else {
						$("#modal-loadInto").children().remove();
						eraseCookie("schedule_customer");
						$.alert({
							title: 'Booked!',
							content: 'Successfully booked the appointment',
							type: 'green',
							autoClose: 'close|5000',
							buttons: {
								close: { btnClass: 'btn-green' }
							},
							theme: 'material', boxWidth: '250px', backgroundDismiss: true, useBootstrap: false
						});
					}
				});
			}
		}
	});
}(jQuery));


// Load Appointments
function loadAppointments(appointments) {
// Check Length
try { appointmentCount = appointments.length; } catch(e) { appointmentCount = 0; }
$(document).ready(function() {
	// Appointments
	var editing = 0;
	$('.appointment').remove();
	setTimeout(function() {$('.loader-case').css({display: 'none'})}, 350);
	// Prevent Errors
	if (appointmentCount == 0) { return; }
	// Loop
	appointments.forEach(function(app) {
		// Variables
		var row = moment(app.AppTimeBegin, "HH:mm").format("H:mm");
		// Column
		var colID;
		if ($("#col-" + app.AppProviderID).length <= 0) {
			colID = "#col-" + parseInt(app.AppProviderID-1);
			$.alert({title: 'Appointment Error', content: 'Invalid employee for '+ app.AppCusName +'. Reassigned to ' + headers[app.AppProviderID-1] +' instead.', type: 'red', theme: 'material',boxWidth: '500px',backgroundDismiss: true,useBootstrap: false});
		} else {
			colID = "#col-" + app.AppProviderID;
		}

		// Length
		if ((app.AppTimeLengthMin / 60) > 1) {
			lengthPX = (app.AppTimeLengthMin / 60) * 88.5 + "px";
		} else {
			lengthPX = (app.AppTimeLengthMin / 60) * 80 + "px";
		}

		// Appointment Details (Name, Time Length, Etc)
		var appID = app.AppID;
		var CusName = app.AppCusName;
		var timeBegin = moment(app.AppTimeBegin, "HH:mm");
		var timeEnd = moment(app.AppTimeBegin, "HH:mm").add(app.AppTimeLengthMin, "minutes");

		// Append
		var div = $("<div class='appointment' data-appServiceID='"+ app.AppServiceID +"'><div class='drag-handle'>=</div><div class='top-case'><div class='app-info-case'><span class='cus-name'>"+ app.AppCusName +"</span><span class='app-service'>"+ app.AppServiceLabel +"</span></div><span class='app-time'>"+ timeBegin.format("h:mm - ") + timeEnd.format("h:mm a") +"</span></div> <span class='app-initials'>["+ app.AppScheduledByInitials +"]</span></div>");
		$(colID + " .rowSection[data-time = '"+row+"']").append(div);
		$(div).css({height: lengthPX});

		// If App is Done
		if (app.AppStatus === 'done') { $(div).addClass('done'); }

		// App Edit Function
		$(div).mousedown(function(e) {
			if (e.which === 3) {
				$(div).contextmenu(function() {
					return false;
				});
				// Reset Prev Clicks
				toggleAppControls(1);
				editing = 1;
				$('.appointment.editing').removeClass('editing');
				$('.rowSection').off('click');
				$(div).addClass('editing');
				// Move Appointment
				$('.rowSection').click(function() {
					var rowSection = $(this);
					$.confirm({
						title: 'Reschedule Appointment',
						content: 'Are you sure you want to reschedule <b>'+ CusName +'</b> from <b>'+ timeBegin.format("h:mm a") +'</b> to <b>'+ moment($(rowSection).data('time'), "H:mm").format("h:mm a") +'</b>?',
						buttons: {
						confirm: {
							btnClass: 'btn-green',
							action: function() {
								// Update DB
								var app = {AppID: appID, AppTimeBegin: moment($(rowSection).data('time'), "H:mm").format("HH:mm"), AppProviderID: $(rowSection).parent().parent().data('col'), AppDate: currentdate}
								$.post("hook.php", { function: 'updateAppPos', searchArg: JSON.stringify(app) }, function(data) {
									var data = JSON.parse(data);
									if (data.status == 1) {
										// Update classes
										$(div).appendTo($(rowSection)).removeClass('editing');
										$('.rowSection').off('click');
										toggleAppControls(0);
										editing = 0;
									} else if (data.message.length > 0) {
										$.alert({
											title: 'Internal Error',
											content: 'While updating the appointment time, an error occured.',
											type: 'red',
											autoClose: 'dismiss|5000',
											buttons: {
												dismiss: { }
											},
											theme: 'material',boxWidth: '250px',backgroundDismiss: true,useBootstrap: false
										});
									}
								});
							}
						},
						cancel: {
							action: function() {
								$(div).removeClass('editing');
								$('.rowSection').off('click');
								toggleAppControls(0);
								editing = 0;
							}
						}
						},
						theme: 'material',boxWidth: '500px',backgroundDismiss: true,useBootstrap: false
					});
					return false;
				});
				// Cancel Editing
				$('.appointment').click(function() {
					$(div).removeClass('editing');
					$('.rowSection').off('click');
					editing = 0;
					toggleAppControls(0);

				});
			} else if (e.which === 1 && editing == 0) {
				populateInfoPopup(appID);
			}
		});

		function toggleAppControls(open = null) {
			var currentPos = $('.vehicle-controls').css('right');
			$('#remove-fab').off('click');
			$('#edit-fab').off('click');
			$('#invoice-fab').off('click');
			if (open == 1 || currentPos > 0) {
				$('.vehicle-controls').stop(true,true).show().css({top: $('.columnHeader').offset().top+$('.columnHeader').height()}).animate({right: '16px'}, 350);
				// Invoice Fab
				$('#invoice-fab').click(function() {
					createInvoice(app.AppCusID, app.AppVehicleID);
				});

				// Edit Fab
				$('#edit-fab').click(function() {
					populateEditPopup(appID);
				});

				// Delete Fab
				$('#remove-fab').click(function() {
					$.confirm({
						title: 'Delete Appointment',
						content: 'Are you sure you want to remove this appointment for ' + CusName + '?',
						type: 'red',
						buttons: {
							delete: {
								btnClass: 'btn-red',
								action: function() {
									removeAppointment(appID);
									$(div).remove();
									toggleAppControls(0);
								}
							},
							cancel: {}
						},
						theme: 'material', boxWidth: '250px', backgroundDismiss: true, useBootstrap: false
					});
				});
			} else {
				$('.vehicle-controls').animate({right: '-185px'}, function() { $(this).hide(); });
			}
		}

	});

	// Create Invoice
	function createInvoice(CusID, CarID) {
		// Create Cookie, Load Invoice
		setCookie("create_invoice", JSON.stringify({CusID: CusID, CarID: CarID}), "1");
		loadPage("Invoice", "invoice.html", 0);
		$("#schedule-btn").removeClass("active");
		$("#invoice-btn").addClass("active");
	}

	// Populate Info Popup
	function populateInfoPopup(id) {
		$('#modal-loadInto').load("assets/html/scheduleInfoModal.html", function() {
			var loadinto = $(this);
			var modalCase = $("#schedule-popup");
			var modal = $("#schedule-popup .popup");

			// Load Data
			try {
			$.post("hook.php", { function: 'getAppByID', searchArg: id}, function(data) {
				data = JSON.parse(data)[0];
				$('.popup #date').text(moment(data.AppDate, "MM/DD/YY").format("MMM Do, YYYY") +" ("+ moment(data.AppTimeBegin, "HH:mm").format("h:mm a - ") + moment(data.AppTimeBegin, "HH:mm").add(data.AppTimeLengthMin, "m").format("h:mm a") +")");
				$('.popup #customer').text(data.AppCusName);
				$('.popup #contact').text(data.AppPOC +'\n'+ data.AppPOCNum)
				$('.popup #service').text(data.AppServiceLabel);
				$('.popup #comment').text(data.AppNotes);

			});
			} catch(e) { throw e; }

			// Detect Click Off
			$(modalCase).click(function(event) {
				if (!$(modal).is(event.target) && $(modal).has(event.target).length === 0) { $(loadinto).children().remove(); }
			});
		});
	}

	// Populate Edit Popup
	function populateEditPopup(id) {

	}

	// Remove Appointment
	function removeAppointment(id) {
		$.post("hook.php", { function: 'removeAppByID', searchArg: id}, function(data) {
			$('.rowSection').off('click');
			if (JSON.parse(data).status == 0) {
				$.alert({title: 'Opps!', content: 'Deleting the appointment failed.', type: 'red'});
			}
		});
	}

	// Add Done Strips
	$('.appointment.done').each(function() {
		var color = $(this).css('border-color');
		$(this).css({'background-image': 'repeating-linear-gradient(-157deg,'+ color +'4px,'+ color +'6px, transparent 5px, transparent 27px)'});
	});
});
}
