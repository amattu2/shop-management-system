// Current Customer (Used by Refresh Fab)
var currentCustomer = {'CusID': 0};

/*********************************************************************/
/*								     */
/*			    DOC READY PREP		             */
/*								     */
/*********************************************************************/
$(document).ready(function() {
	// Clear Prev Timeout
	clearTimeout();

	// Assign Button OnClicks
	$('.tabList .option').each(function() {
		// Each Btn
		$(this).on('click', function() {
			// Tab Selections
			$('.tabList .option.selected').removeClass('selected');
			$(this).addClass('selected');
			// Containers
			$('.invoices .case.selected').removeClass('selected');
			$($(this).data('target')).addClass('selected');

		});
	});

	// Create Customer Button
	$('.option-div').click(toggleOptionDiv);

	function toggleOptionDiv() {
		var invoiceOptions = $('.option-list');
		if ($(invoiceOptions).hasClass('showing')) {
			$(invoiceOptions).removeClass('showing');
			$(window).off('click');
		} else {
			$(invoiceOptions).addClass('showing');
			setTimeout(function() {
				$(window).click(function() {
					if (!$(invoiceOptions).is(event.target) && $(invoiceOptions).has(event.target).length === 0) { toggleOptionDiv(); }
				});
			}, 75);
		}
	}

	// Load Customer List
	$('#customerListLoader').css({display: 'flex'});
	setTimeout(function() {
		// Customer List
		if (Lockr.get('customers') !== undefined) {
			data = Lockr.get('customers');
			for(var i = 0; i < data.length; i++) {
				var obj = data[i];
				$('#customerList').append("<tr class='customer' data-CusID='"+ obj.CusID +"' onclick='fetchCustomerByID("+ obj.CusID +");'><td class='number'>&#9744;</td><td class='text'>"+ obj.name +"</td></tr>");
			}
			setTimeout(function() { $('#customerListLoader').css({display: 'none'}); }, 650);
		} else {
			var customerList = Array();
			$.post("hook.php", { function: 'getAllCustomerNames' }, function(data) {
				data = JSON.parse(data);
				for(var i = 0; i < data.length; i++) {
					var obj = data[i];
					customerList.push({CusID: obj.CusID, name: obj.CusFirstName + " " + obj.CusLastName});
					$('#customerList').append("<tr class='customer' data-CusID='"+ obj.CusID +"' onclick='fetchCustomerByID("+ obj.CusID +");'><td class='number'>&#9744;</td><td class='text'>"+ obj.CusFirstName + " " + obj.CusLastName +"</td></tr>");
				}
				setTimeout(function() { $('#customerListLoader').css({display: 'none'}); Lockr.set('customers', customerList); }, 650);
			});
		}
	}, 650);

	// Assign Onclicks
	$('#refresh-fab').on('click', function() {
		if (currentCustomer.CusID !== 0) {
			fetchCustomerByID(currentCustomer.CusID, 1);
		}
	});

	$('#lockCusFAB').on('click', function() {
		if (currentCustomer.CusID !== 0) {
			$.post("hook.php", { function: 'lockCusByID', searchArg: currentCustomer.CusID}, function(data) {
				if (JSON.parse(data).status == 1) {
					$.alert({
						title: 'Success!',
						content: 'Successfully disabled the customer&apos;s account',
						type: 'green',
						autoClose: 'close|3500',
						buttons: {
							close: function(){ }
						},
						theme: 'material',boxWidth: '500px',useBootstrap: false
					});
					fetchCustomerByID(currentCustomer.CusID, 1);
				} else {
					$.alert({
						title: 'Error!',
						content: JSON.parse(data).message,
						type: 'red',
						autoClose: 'close|6500',
						buttons: {
							close: function(){ }
						},
						theme: 'material',boxWidth: '500px',useBootstrap: false
					});
				}
			});
		}
	});

	$('#softDelFAB').on('click', function() {
		if (currentCustomer.CusID !== 0) {
			$.post("hook.php", { function: 'softDeleteCusByID', searchArg: currentCustomer.CusID}, function(data) {
				if (JSON.parse(data).status == 1) {
					$.alert({
						title: 'Success!',
						content: 'Successfully disabled the customer&apos;s account',
						type: 'green',
						autoClose: 'close|3500',
						buttons: {
							close: function(){ }
						},
						theme: 'material',boxWidth: '500px',useBootstrap: false
					});
					$("[data-cusid='"+currentCustomer.CusID+"']").remove();
					currentCustomer.CusID = 0;
				} else {
					$.alert({
						title: 'Error!',
						content: JSON.parse(data).message,
						type: 'red',
						autoClose: 'close|6500',
						buttons: {
							close: function(){ }
						},
						theme: 'material',boxWidth: '500px',useBootstrap: false
					});
				}
			});
		}
	});

	$('#purgeFAB').on('click', function() {
		if (currentCustomer.CusID !== 0) {
			$.post("hook.php", { function: 'purgeCusByID', searchArg: currentCustomer.CusID}, function(data) {
				if (JSON.parse(data).status == 1) {
					$.alert({
						title: 'Success!',
						content: 'Successfully disabled the customer&apos;s account',
						type: 'green',
						autoClose: 'close|3500',
						buttons: {
							close: function(){ }
						},
						theme: 'material',boxWidth: '500px',useBootstrap: false
					});
					$("[data-cusid='"+currentCustomer.CusID+"']").remove();
					currentCustomer.CusID = 0;
				} else {
					$.alert({
						title: 'Error!',
						content: JSON.parse(data).message,
						type: 'red',
						autoClose: 'close|6500',
						buttons: {
							close: function(){ }
						},
						theme: 'material',boxWidth: '500px',useBootstrap: false
					});
				}
			});
		}
	});

	$('#newCustomerSubmit').on('click', createCustomer);

	// Toggle Create Customer Type
	$('#companyCheckbox').on('change', function() {
		if ($(this).is(":checked")) {
			$('#createCusFirstNameGroup').hide();
			$('#createCusLastNameGroup label').text('Company Name');
		} else {
			$('#createCusFirstNameGroup').show();
			$('#createCusLastNameGroup label').text('Last Name');
		}
	});

	function createCustomer() {
		// Customer Variables
		var isCompany = $('#companyCheckbox').is(":checked");
		var CusFirst = $('#createCusFirstNameGroup input').val();
		var CusLast = $('#createCusLastNameGroup input').val();
		// Validate, Submit
		if (isCompany == true) {
			if (!isEmpty(CusLast)) {
				var company = JSON.stringify({company: '1', 'CusLast': CusLast});
				$.post("hook.php", { function: 'createCustomer', searchArg: company}, function(data) {
					fetchCustomerByID(data);
					$.alert({
						title: 'Success!',
						content: 'Created the company, please update the contact information',
						type: 'green',
						autoClose: 'close|6500',
						buttons: {
							close: function(){ }
						},
						theme: 'material',
						boxWidth: '500px',
						useBootstrap: false
					});
				});
			} else {
				$.alert({
					title: 'Opps!',
					content: 'The company name cannot be empty!',
					type: 'red',
					autoClose: 'close|6500',
					buttons: {
						close: function(){ }
					},
					theme: 'material',
					boxWidth: '500px',
					useBootstrap: false
				});
			}
		} else if (isCompany == false) {
			if (!isEmpty(CusLast) && !isEmpty(CusFirst)) {
				var customer = JSON.stringify({company: '0', 'CusLast': CusLast, 'CusFirst': CusFirst});
				$.post("hook.php", { function: 'createCustomer', searchArg: customer}, function(data) {
					fetchCustomerByID(data);
					$.alert({
						title: 'Success!',
						content: 'Created the customer, please update the contact information',
						type: 'green',
						autoClose: 'close|6500',
						buttons: {
							close: function(){ }
						},
						theme: 'material',boxWidth: '500px',useBootstrap: false
					});
				});
			} else {
				$.alert({
					title: 'Opps!',
					content: 'The customer name cannot be empty',
					type: 'red',
					autoClose: 'close|6500',
					buttons: {
						close: function(){ }
					},
					theme: 'material',boxWidth: '500px',useBootstrap: false
				});
			}
		}
	}

	// Search Customer
	$('#customerName').on('keyup keydown', function() {
		// Detect Backspace
		var key = event.keyCode || event.charCode;
		if (key == 8 || key == 46) {
			$('.customer').each(function() {
				$(this).removeClass('hidden');
			});
		}

		// Search DIVs
		if (key == 13) {
			var searchValue = $(this).val();
			$(".customer").each(function(){
				if (!($(this).html().indexOf(searchValue) > -1)) {
					$(this).addClass('hidden');
				}
			});
		}
	});

	// Left Side Expand/Open
	$('.left .box .icon').each(function() {
		$(this).click(function() {
			$(this).parent().parent().find('.body').slideToggle(400);
		});
	});
});

/*********************************************************************/
/*								     */
/*			    FETCH CUSTOMER		             */
/*								     */
/*********************************************************************/
// Fetch Customer Info
function fetchCustomerByID(id, override = 0) {
	if (id == currentCustomer.CusID && override !== 1) { return true; }

	$(document).ready(function() {
		$('#customerInfoLoader').css({display: 'flex'});

		$.ajax({type: "POST", url: "hook.php", data: { function: 'getCustomerByID', searchArg: id },
		success: function(data) {
			customer = JSON.parse(data)[0];
			customerCompany = null;
			currentCustomer = customer;

			// If unsuccessful
			if (customer === null) { alert('Error fetching data. Limited functionality.'); return false; }

			// Company/Person Specific
			if (customer.Company == 'False') {
				$('#name').text(customer.CusFirstName + " " + customer.CusLastName);
				$('#accountType').html("<i class='fa fa-user'></i>");
				customerCompany = false;
			} else if (customer.Company == 'True') {
				$('#name').text(customer.CusLastName);
				$('#accountType').html("<i class='fa fa-building'></i>");
				customerCompany = true;
			}

			if (customer.CusNotes.trim() == '') {
				$('#NoCusNotes').css({display: 'block'});
				$('#CusNotes').css({display: 'none'});
			} else {
				$('#CusNotes').text(customer.CusNotes);
				$('#NoCusNotes').css({display: 'none'});
				$('#CusNotes').css({display: 'block'});
			}

			// Customer Address
			if (customer.CusStreet1.trim().length > 1) {
				var street = customer.CusStreet1 +", ";
			} else { street = ''; }
			if (customer.CusCity.trim().length > 1) {
				var city = customer.CusCity +" "+ customer.CusState;
			} else { city = ''; }
			if (customer.CusZip.trim().length > 1) {
				var zip = ", " + customer.CusZip;
			} else { zip = ''; }
			$('#CusAddress').empty().text(street + city + zip).parent().css({display: 'flex'});

			// Customer Account Locked
			if (customer.isLocked == 1) {
				$('.customer-info').append("<div class='customer-locked'><h2>This account is locked</h2><p>..And cannot be <b>Booked, Edited, or Removed</b>.</p></div>");
				$('.right .fabs .body').slideUp(function() {
					$(this).hide();
				});
			} else {
				$('.customer-locked').remove();
				$('.right .fabs .body').show(function() {
					$(this).slideDown();
				});
			}

			// Scroll Top
			$('.customer-info .left').animate({scrollTop: 0}, 'slow');
			$('.customer-info .right').animate({scrollTop: 0}, 'slow');

			// Update Other Data
			fetchCusInvoices(customer.CusID);
			fetchCusAppointments(customer.CusID);
			fetchAppStats(customer.CusID);
			fetchAllVehicles(customer.CusID);
			setupCusContacts(customerCompany, customer.CusHome, customer.CusWork, customer.CusCell, customer.CusEmail_H, customer.CusEmail_W, customer.CusFax);
			setupSystemNotes(customer.CusID, customer.CusEmail_H, customer.CusEmail_W);

			// Hide Loader
			setTimeout(function() { $('#customerInfoLoader').css({display: 'none'}); }, 1000);
		}
		});

		// Get & Display customer vehicles
		function fetchAllVehicles(id) {
			$.post("hook.php", { function: 'getAllVehiclesByCusID', searchArg: id}, function(data) {
				vehicles = JSON.parse(data);
				if (vehicles !== null) {
					// Remove Previous
					$('.customerVehicles #vehicle-list').empty();
					// Iterate through invoices
					for (var i = 0; i < vehicles.length; i++) {
						var obj = vehicles[i];
						$('#vehicle-list').append("<tr title='"+ obj.Truck +"'><td class='number'>"+ obj.ModYear +"</td><td class='number'>"+ obj.Make +"</td><td class='text'>"+ obj.Model +"</td><td><div class='vehicleToolBtn' onclick='populateVehicleModal("+ obj.CarId +","+ currentCustomer.CusID +")'><i class='fa fa-info'></i></div></td></tr>");
					}
				}
			});
		}

		// Get & Display customer invoices
		lastCustomerInvoiceYear = [];
		function fetchCusInvoices(id) {
			$.post("hook.php", { function: 'getAllInvoicesByCusID', searchArg: id}, function(data) {
				invoices = JSON.parse(data);
				if (invoices == null) {
					$('#invoice-case .noData').css({display: 'block'});
					$('#invoice-case .inner-case').css({display: 'none'});
				} else {
					$('#invoice-case .inner-case').html("");
					$('#invoice-case .noData').css({display: 'none'});
					$('#invoice-case .inner-case').css({display: 'block'});
					// Iterate through invoices
					for(var i = 0; i < invoices.length; i++) {
						var obj = invoices[i];
						var invDate = moment(obj.EstDate, 'M/D/YYYY k:mm');
						lastCustomerInvoiceYear.push(invDate.format('YYYY'));
						if (obj.EstDesc.length >= 19) { obj.EstDescShort = shortenString(obj.EstDesc, 19); } else { obj.EstDescShort = obj.EstDesc; }
						$('#invoice-case .inner-case').append("<div class='invoice' onclick='buildInvoice("+ obj.EstNum +")'><div class='date' title='"+ invDate.format('h:mma M/D/YYYY') +"'>"+ invDate.format('M/D') +"</div><div class='desc' title='"+ obj.EstDesc +"'>"+ obj.EstDescShort +"</div><div class='vehicle'>"+ obj.ModYear + " " + obj.Model +"</div></div>");
					}
				}
			});
		}

		// Get & Display Customer Appts
		function fetchCusAppointments(id) {
			$.post("hook.php", { function: 'getCusApptsByCusID', searchArg: id}, function(data) {
				appointments = JSON.parse(data);
				if (appointments == null) {
					$('#appointment-case .noData').css({display: 'block'});
					$('#appointment-case .inner-case').css({display: 'none'});
				} else {
					$('#appointment-case .inner-case').html("");
					$('#appointment-case .noData').css({display: 'none'});
					$('#appointment-case .inner-case').css({display: 'block'});
					// Iterate through invoices
					for (var i = 0; i < appointments.length; i++) {
						var obj = appointments[i];
						appDate = moment(obj.AppDate, 'MM/DD/YY');
						appTime = moment(obj.AppTimeBegin, 'hh:mm A');
						$('#appointment-case .inner-case').append("<div class='appointment'><div class='date' title='"+ appDate.format('MM/DD/YYYY') +"'>"+ appDate.format('M/D') +"</div><span class='desc'>"+ obj.AppServiceLabel +"</span><div class='length'>"+ appTime.format('h:mm A') + "-" + appTime.add(obj.AppTimeLengthMin, 'm').format('h:mm A') +"</div>");
					}
				}
			});
		}

		// Get & Display Customer App Stats
		function fetchAppStats(CusID) {
			$('#appStats').empty();
			$.post("hook.php", { function: 'getCusApptStats', searchArg: CusID}, function(data) {
				try {
					data = JSON.parse(data);
					for (var i = 0; i < data.length; i++) {
						var obj = data[i];
						$('#appStats').append("<tr><td style='text-transform: capitalize'>"+ obj.AppStatus +"</td><td>"+ obj.AppDate +"</td><td style='font-size: 14px;'>"+ obj.AppServiceLabel +"</td></tr>");
					}
				} catch(e) {}
			});
		}

		// Display Customer Contact Methods
		var contactMethodCount = 0; // Used by System Notes
		function setupCusContacts(company, CusHome, CusWork, CusCell, CusEmail_H, CusEmail_W, CusFax) {
			// Company
			if (company) {

			}
			// Home Number
			if (CusHome !== '' && CusHome !== null && stripNumber(CusHome) !== '') {
				$('#CusHome').text(addDashes(CusHome));
				$('#CusHome').parent().css({display: 'flex'});
				contactMethodCount++;
			} else { $('#CusHome').parent().css({display: 'none'}); }
			// Work Number
			if (CusWork !== '' && CusWork !== null && stripNumber(CusWork) !== '') {
				$('#CusWork').text(addDashes(CusWork));
				$('#CusWork').parent().css({display: 'flex'});
				contactMethodCount++;
			} else { $('#CusWork').parent().css({display: 'none'}); }
			// Cell Numbers
			if (CusCell !== '' && CusCell !== null && stripNumber(CusCell) !== '') {
				$('#CusCell').text(addDashes(CusCell));
				$('#CusCell').parent().css({display: 'flex'});
				contactMethodCount++;
			} else { $('#CusCell').parent().css({display: 'none'}); }
			// Husband's Email Address
			if (CusEmail_H !== '' && CusEmail_H !== null) {
				$('#CusEmail_H').text(CusEmail_H);
				$('#CusEmail_H').parent().css({display: 'flex'});
			} else { $('#CusEmail_H').parent().css({display: 'none'}); }
			// Wife's Email Address
			if (CusEmail_W !== '' && CusEmail_W !== null) {
				$('#CusEmail_W').text(CusEmail_W);
				$('#CusEmail_W').parent().css({display: 'flex'});
			} else { $('#CusEmail_W').parent().css({display: 'none'}); }
			if (CusFax !== '' && CusFax !== null && stripNumber(CusFax) !== '') {
				$('#CusFax').text(addDashes(CusFax));
				$('#CusFax').parent().css({display: 'flex'});
				contactMethodCount++;
			} else { $('#CusFax').parent().css({display: 'none'}); }
		}

		// Get & Display system notes
		function setupSystemNotes(CusID, CusEmail_H, CusEmail_W) {					
			// System Note Count
			var noteCount = 0;

			// Recent Visits (Must be delayed)
			setTimeout(function(){
				var LI = moment(lastCustomerInvoiceYear[0], "YYYY").diff(moment(), 'years');
				if (!(LI <= 0 && LI >= -1)) {
					$('#CusNotHereRecently').css({display: 'block'});
					noteCount++;
				} else {
					$('#CusNotHereRecently').css({display: 'none'});
				}
				finalizeNotes();
			}, 850);
			// Email
			if (isEmpty(CusEmail_H) && isEmpty(CusEmail_W)) {
				$('#NoCusEmail').css({display: 'block'});
				noteCount++;
			} else {
				$('#NoCusEmail').css({display: 'none'});
			}
			// Customer Update
			$.post("hook.php", { function: 'getAllLogsByCusID', searchArg: CusID}, function(data) {
				logs = JSON.parse(data)
				if (logs == null) {
					$('#CusNotUpdated').css({display: 'block'});
					noteCount++;
				} else {
					$('#CusNotUpdated').css({display: 'none'});
					for(var i = 0; i < logs.length; i++) {
						var obj = logs[i];
						// Verify Logs are about customer data, not something else
					}
				}
			});
			// Customer Contacts
			if (contactMethodCount == 0) {
				$('#NoCusContact').css({display: 'block'});
			} else {
				$('#NoCusContact').css({display: 'none'});
			}

			// System Note Count
			function finalizeNotes() {
				if (noteCount >= 1) {
					$('#NoSystemNotes').css({display: 'none'});
					$('#SystemNotes').css({display: 'block'});
				} else {
					$('#NoSystemNotes').css({display: 'block'});
					$('#SystemNotes').css({display: 'none'});
				}
			}
		}
	});
}


/*********************************************************************/
/*								     */
/*			    CAR POPUP MODAL		             */
/*								     */
/*********************************************************************/
// Car Modal
function populateVehicleModal(CarId, CusId) {
$(document).ready(function() {
	// Remove Previous Data
	$('#vehicleServiceHistory').empty();

	// Variables
	var Car = '';
	var Invoices = '';
	var noteArray = [];
	var CustomerID = CusId;

	// Divs
	var vehicleModal = $('.vehicleModal');
	var Loader = $('.modal-content .loader-case');

	// Show Loader
	$(vehicleModal).show();
	$(Loader).css({display: 'flex'});

	// Fetch Car
	$.post("hook.php", { function: 'getVehicleByCarID', searchArg: CarId}, function(data) {
		Car = JSON.parse(data)[0];
		populateBegin();
	});

	// Fetch Invoices
	$.post("hook.php", { function: 'getAllInvoicesByCarID', searchArg: CarId}, function(data) {
		Invoices = JSON.parse(data).reverse();
		if (Invoices == null) {
			$('#noServiceHistory').css({display: 'block'});
			$('#vehicleServiceHistory').css({display: 'none'});
		} else {
			$('#noServiceHistory').css({display: 'none'});
			$('#vehicleServiceHistory').css({display: 'block'});
			// Append Years
			for (var i = 0; i <= 3; i++) {
				y = new Date().getFullYear()-i;
				$('#vehicleServiceHistory').append("<div id='"+ y +"'><p class='background'><span>"+ y +"</span></p></div>");
			}
			// Append Other Years
			var yMinus3 = new Date().getFullYear()-3;
			$('#vehicleServiceHistory').append("<div id='other'><p class='background'><span>Before "+ yMinus3 +"</span></p></div>");

			for (var i = 0; i < Invoices.length; i++) {
				var obj = Invoices[i];
				InvDate = moment(obj.EstDate, 'M/D/YYYY HH:mm');
				InvYear = InvDate.year();
				if (obj.EstDesc.length >= 30) { obj.EstDescShort = shortenString(obj.EstDesc, 30); } else { obj.EstDescShort = obj.EstDesc; }
				if (obj.Notes !== '' && obj.Notes !== ' ' && obj.Notes !== null) {
					var notes = "<span style='background: #e74c3c;' title='"+ obj.Notes.trim() +"'>Notes</span>";
					noteArray.push(obj.Notes);
				} else { var notes = ''; }
				var invoiceDiv = $("<div class='vehicleService'><span class='date' title='"+ InvDate.format(' h:mm A M/D/YYYY') +"'>"+ InvDate.format('M/D') +"</span><div class='options'><span class='option'>View</span> | <span class='option' onclick='buildInvoice("+ obj.EstNum +")'>Edit</span></div><div class='bottomCase'><span>"+ obj.TicketType +"</span><span class='cost'>$"+ numeral(obj.Total).format('0,0.00') +"</span><span class='mileage'>"+ numeral(obj.Mileage).format('0,0') + "mi</span>"+ notes +"</div><span class='desc' title='"+ obj.EstDesc +"'>" + obj.EstDescShort + "</span></div>");
				// Append
				if (InvYear == new Date().getFullYear()) {
					$(invoiceDiv).insertAfter("#vehicleServiceHistory #"+ new Date().getFullYear());
				} else if (InvYear == new Date().getFullYear()-1) {
					$(invoiceDiv).insertAfter("#vehicleServiceHistory #"+ (new Date().getFullYear()-1));
				} else if (InvYear == new Date().getFullYear()-2) {
					$(invoiceDiv).insertAfter("#vehicleServiceHistory #"+ (new Date().getFullYear()-2));
				} else if (InvYear == new Date().getFullYear()-3) {
					$(invoiceDiv).insertAfter("#vehicleServiceHistory #"+ (new Date().getFullYear()-3));
				} else {
					$(invoiceDiv).insertAfter("#vehicleServiceHistory #other");
				}
			}
		}
	});

	// Begin Function
	function populateBegin() {
		// Verification
		if (Car.CusId != CusId) {
			console.log("Technical details: function failed because vehicle customer ID ["+ Car.CusId +"] does not match supplied ID of: " + CusId);
			alert('Verification error. Limited functionality. Please do not edit vehicle or customer.');
			return false;
		}

		// APPEND CAR DATA TO MODAL
		if (Car.ModYear !== null && Car.Make !== null && Car.Model !== null) {
			$('.modal-content .vehicleYMM .body').empty();
			$('.modal-content .vehicleYMM .body').append("<div><span>" + Car.ModYear +"</span>&nbsp;<span>"+ $.trim(Car.Make) +"</span>&nbsp;<span>"+ $.trim(Car.Model) +"</span></div>");
		} else {
			$('.modal-content .vehicleYMM .body').empty();
			$('.modal-content .vehicleYMM .body').append("<span class='noData'>Nothing to display</span>");
		}

		if (Car.Mileage !== null) {
			$('.modal-content .mileage .body').empty();
			if (Car.Mileage >= 0) {
				$('.modal-content .mileage .body').append("<span>"+ numeral(Car.Mileage).format('0,0') +"mi</span>");
			} else {
				$('.modal-content .mileage .body').append("<span class='noData'>Mileage below 0</span>");
			}
		} else {
			$('.modal-content .mileage .body').empty();
			$('.modal-content .mileage .body').append("<span class='noData'>Nothing to display</span>");
		}

		if (Car.VIN !== null && Car.VIN !== '') {
			$('.modal-content .vin .body').empty();
			if (Car.VIN.trim().length == 17) {
				var phonetic = getPhonetic(Car.VIN.slice(9));
				$('.modal-content .vin .body').append("<span title='"+ phonetic +"'>"+ Car.VIN +"</span><div class='last8'></div>");
			} else {
				$('.modal-content .vin .body').append("<span class='invalidData'>"+ Car.VIN +"</span>");
			}
		} else {
			$('.modal-content .vin .body').empty();
			$('.modal-content .vin .body').append("<span class='noData'>Nothing to display</span>");
		}

		if (Car.Tag !== null) {
			$('.modal-content .tag .body').empty();
			if (Car.Tag == '' || Car.Tag == ' ') {
				$('.modal-content .tag .body').append("<span class='noData'>Nothing to display</span>");
			} else if (Car.Tag.toLowerCase() == 'temp' || Car.Tag == 'tmp') {
				$('.modal-content .tag .body').append("<span class='invalidData'>"+ Car.Tag +"</span>");
			} else {
				$('.modal-content .tag .body').append("<span>"+ Car.Tag +"</span>");
			}
		} else {
			$('.modal-content .tag .body').empty();
			$('.modal-content .tag .body').append("<span class='noData'>Nothing to display</span>");
		}

		if (Car.Truck !== null && Car.Truck !== '' && Car.Truck !== ' ') {
			$('.modal-content .truck .body').empty();
			$('.modal-content .truck .body').append("<div><span>" + Car.Truck +"</span></div>");
		} else {
			$('.modal-content .truck .body').empty();
			$('.modal-content .truck .body').append("<span class='noData'>Nothing to display</span>");
		}

		if (Car.EngDesc !== null && Car.EngDesc !== '' && Car.EngDesc !== ' ') {
			$('.modal-content .engine .body').empty();
			$('.modal-content .engine .body').append("<span>"+ Car.EngDesc +"</span>");
		} else {
			$('.modal-content .engine .body').empty();
			$('.modal-content .engine .body').append("<span class='noData'>Nothing to display</span>");
		}

		// Service Recommendations
		var mileageBoxBody = $('.modal-content .mileageServices .body');
		if (Car.Mileage !== '' && Car.Mileage !== null && Car.Mileage !== '0' && Car.Mileage !== ' ') {
			var rec = getServiceRec(Car.Mileage);
			$(mileageBoxBody).empty();
			for (i = 0; i < rec.length; i++) {
				$(mileageBoxBody).append("<div class='serviceRec'> - "+ rec[i] +"</div>");
			}
		} else {
			$(mileageBoxBody).empty();
			$(mileageBoxBody).append("<span class='noData'>No service recommendations</span>");
		}

		// Vehicle Recent Notes [Must be delayed]
		$('.modal-content .recentNotes .body').empty();
		setTimeout(function(){
			if (noteArray.length !== 0) {
				 $('.modal-content .recentNotes .body').append("<span class='vehicleNotes'>"+ noteArray[noteArray.length-1].trim() +"</span>");
			} else { $('.modal-content .recentNotes .body').append("<span class='noData'>Nothing to display</span>"); }
		}, 850);

		// Show/Hide Div
		setTimeout(function(){ $(Loader).css({display: 'none'}); }, 1000);
		$(window).click(function() {
			if (!$('.vehicleModal .modal-content').is(event.target) && $('.vehicleModal .modal-content').has(event.target).length === 0) {
				hideModal();
			}
		});
		$(document).keyup(function(e) {
			if (e.keyCode == 27) { hideModal(); }
		});
		function hideModal() {
			$(vehicleModal).hide();
			$(window).off('click');
			$(document).off('keyup');
		}
	}
});
}

/*********************************************************************/
/*								     */
/*		      Schedule Customer Function	             */
/*								     */
/*********************************************************************/
function bookAppt() {
$(document).ready(function() {
	if (currentCustomer.CusID == null || currentCustomer.CusID == 0) { return false }
	// Variables
	var customerArray = {};
	// Build Modal
	$('#loadModalIntoCase').load('assets/html/bookCustomerPopup.html', function() {
		setTimeout(function() {
		var ModalContainerChildren = $('#loadModalIntoCase').children();
		var Modal = $('#bookCustomerModal');
		var ModalContent = $('#bookCustomerModal .modal-content');

		$.post("hook.php", { function: 'getAllVehiclesByCusID', searchArg: currentCustomer.CusID}, function(data) {
			vehicles = JSON.parse(data);
			if (vehicles !== null) {
				// Iterate through invoices
				for (var i = 0; i < vehicles.length; i++) {
					var obj = vehicles[i];
					$("#customer-vehicle-select").append("<option value='"+ obj.CarId +"'>"+ obj.ModYear +" "+ obj.Make +" "+ obj.Model+"</option");
				}
			}
		});

		$("#customer-vehicle-select").on('change', function() {
			if ($("#customer-vehicle-select").val() !== ' ' && $("#customer-vehicle-select").val() !== '') {
				// Enable Btn
				$("#customer-book-continue").removeClass('disabled');
				// Continue To Booking
				$("#customer-book-continue").click(function() {
					customerArray.CarID = $("#customer-vehicle-select").val();
					customerArray.CusID = currentCustomer.CusID;
					if (customer.Company === 'True') { customerArray.name = currentCustomer.CusLastName; }
					if (customer.Company !== 'True') { customerArray.name = currentCustomer.CusFirstName + " " + currentCustomer.CusLastName; }
					// Create Cookie, Load Schedule
					setCookie("schedule_customer", JSON.stringify(customerArray), "1");
					loadPage("Schedule", "schedule.html", 0);
					$("#customers-btn").removeClass("active");
					$("#schedule-btn").addClass("active");
				});
			} else {
				$("#customer-book-continue").addClass('disabled');
				$("#customer-book-continue").off('click');
			}
		});

		// Show/Hide Div
		$(Modal).show();
		$(window).click(function() {
			if (!$(ModalContent).is(event.target) && $(ModalContent).has(event.target).length === 0) { hideModal(); }
		});
		$(document).keyup(function(e) {
			if (e.keyCode == 27) { hideModal(); }
		});
		function hideModal() {
			$(ModalContainerChildren).remove();
			$(window).off('click');
			$(document).off('keyup');
		}
		}, 100);
	});
});
}

/*********************************************************************/
/*								     */
/*			CREATE INVOICE Function		             */
/*								     */
/*********************************************************************/
// Create Invoice
function createInvoice() {
$(document).ready(function() {
	if (currentCustomer.CusID == null || currentCustomer.CusID == 0) { return false }
	// Variables
	var customerArray = {};
	// Build Modal
	$('#loadModalIntoCase').load('assets/html/bookCustomerPopup.html', function() {
		setTimeout(function() {
		var ModalContainerChildren = $('#loadModalIntoCase').children();
		var Modal = $('#bookCustomerModal');
		var ModalContent = $('#bookCustomerModal .modal-content');

		$.post("hook.php", { function: 'getAllVehiclesByCusID', searchArg: currentCustomer.CusID}, function(data) {
			vehicles = JSON.parse(data);
			if (vehicles !== null) {
				// Iterate through invoices
				for (var i = 0; i < vehicles.length; i++) {
					var obj = vehicles[i];
					$("#customer-vehicle-select").append("<option value='"+ obj.CarId +"'>"+ obj.ModYear +" "+ obj.Make +" "+ obj.Model+"</option");
				}
			}
		});

		$("#customer-vehicle-select").on('change', function() {
			if ($("#customer-vehicle-select").val() !== ' ' && $("#customer-vehicle-select").val() !== '') {
				// Enable Btn
				$("#customer-book-continue").removeClass('disabled');
				// Continue To Booking
				$("#customer-book-continue").click(function() {
					customerArray.CarID = $("#customer-vehicle-select").val();
					customerArray.CusID = currentCustomer.CusID;
					// Create Cookie, Load Schedule
					setCookie("create_invoice", JSON.stringify(customerArray), "1");
					loadPage("Invoice", "invoice.html", 0);
					$("#customers-btn").removeClass("active");
					$("#invoice-btn").addClass("active");
				});
			} else {
				$("#customer-book-continue").addClass('disabled');
				$("#customer-book-continue").off('click');
			}
		});

		// Show/Hide Div
		$(Modal).show();
		$(window).click(function() {
			if (!$(ModalContent).is(event.target) && $(ModalContent).has(event.target).length === 0) { hideModal(); }
		});
		$(document).keyup(function(e) {
			if (e.keyCode == 27) { hideModal(); }
		});
		function hideModal() {
			$(ModalContainerChildren).remove();
			$(window).off('click');
			$(document).off('keyup');
		}
		}, 100);
	});
});
}
/*********************************************************************/
/*								     */
/*			 SHOW INVOICE Function		             */
/*								     */
/*********************************************************************/
// Build & Show Invoice Modal
// buildInvoice(int EstNum)
function buildInvoice(id) {
$(document).ready(function() {
	if (currentCustomer.CusID == null || currentCustomer.CusID == 0) { return false }
	// Transfer to invoicing page
	setCookie("invoice_id", id, "1");
	loadPage("Invoice", "invoice.html", 0);
	$("#customers-btn").removeClass("active");
	$("#invoice-btn").addClass("active");
});
}

/*********************************************************************/
/*								     */
/*			 ADD VEHICLE FUNCTION		             */
/*								     */
/*********************************************************************/
function addVehicle() {
$(document).ready(function() {
	if (currentCustomer.CusID == null || currentCustomer.CusID == 0) { return false }
	$('#loadModalIntoCase').load('assets/html/addVehicleModal.html', function() {
		// Callback required!
		setTimeout(function() {
		// Vars
		var ModalContainerChildren = $('#loadModalIntoCase').children();
		var Modal = $('#addVehicleModal');
		var ModalContent = $('#addVehicleModal .modal-content');

		$(ModalContent).find('.continue-btn').click(function() {
			alert('clk');
		});

		// Show/Hide Div
		$(Modal).show();
		$(window).click(function() {
			if (!$(ModalContent).is(event.target) && $(ModalContent).has(event.target).length === 0) { hideModal(); }
		});
		$(document).keyup(function(e) {
			if (e.keyCode == 27) { hideModal(); }
		});
		function hideModal() {
			$(ModalContainerChildren).remove();
			$(window).off('click');
			$(document).off('keyup');
		}
		}, 100);
	});
});
}

/*********************************************************************/
/*								     */
/*			 Edit Customer Function 	             */
/*								     */
/*********************************************************************/
function editCustomer() {
$(document).ready(function() {
	if (currentCustomer.CusID == null || currentCustomer.CusID == 0) { return false }

	if (currentCustomer.Company === 'False') {
		// CUSTOMER MODAL
		$('#loadModalIntoCase').load('assets/html/editCustomerModal.html', function() {
			// Callback required!
			setTimeout(function() {
			// Vars
			var ModalContainerChildren = $('#loadModalIntoCase').children();
			var Modal = $('#editCustomerModal');
			var ModalContent = $('#editCustomerModal .modal-content');

			// Load Customer
			$("#editCustomerModal #CusID").text("#" + currentCustomer.CusID);
			$("#editCustomerModal #editCustomerFirstName").val(currentCustomer.CusFirstName);
			$("#editCustomerModal #editCustomerLastName").val(currentCustomer.CusLastName);
			$("#editCustomerModal #editCustomerEmail_H").val(currentCustomer.CusEmail_H);
			$("#editCustomerModal #editCustomerEmail_W").val(currentCustomer.CusEmail_W);
			$("#editCustomerModal #editCustomerCell").val(currentCustomer.CusCell);
			$("#editCustomerModal #editCustomerWork").val(currentCustomer.CusWork);
			$("#editCustomerModal #editCustomerHome").val(currentCustomer.CusHome);
			$("#editCustomerModal #editCustomerFax").val(currentCustomer.CusFax);
			$("#editCustomerModal #editCustomerStreet1").val(currentCustomer.CusStreet1);
			$("#editCustomerModal #editCustomerCity").val(currentCustomer.CusCity);
			$("#editCustomerModal #editCustomerState").val(currentCustomer.CusState);
			$("#editCustomerModal #editCustomerZip").val(currentCustomer.CusZip);

			// Publish Changes
			$('#editCustomerModal #submit').click(function() {
				$('#editCustomerModal .group input').each(function() {
					if (!($(this).val() == currentCustomer[$(this).data('for')]) && $(this).val() !== ' ') {
						var Column = $(this).data('for');
						$.post('hook.php', { function: 'updateCusColumn', searchArg: $(this).data('for'), CusID: currentCustomer.CusID, updatedValue: $(this).val() }, function(data) {
							data = JSON.parse(data);
							if (data.status !== '1') {
								$.alert({
									title: 'Opps!',
									content: 'An error occured while updating customer ' + Column,
									type: 'red',
									autoClose: 'close|6500',
									buttons: {
										close: function(){ }
									},
									theme: 'material',boxWidth: '500px',useBootstrap: false
								});
							}
						});
					}
				});

				setTimeout(function() { fetchCustomerByID(currentCustomer.CusID, 1); hideModal(); }, 100);
			});

			// Show/Hide Div
			$(Modal).show();
			$(window).click(function() {
				if (!$(ModalContent).is(event.target) && $(ModalContent).has(event.target).length === 0) { hideModal(); }
			});
			$(document).keyup(function(e) {
				if (e.keyCode == 27) { hideModal(); }
			});
			function hideModal() {
				$(ModalContainerChildren).remove();
				$(window).off('click');
				$(document).off('keyup');
			}
			}, 100);
		});
	} else {
		// COMPANY MODAL
		$('#loadModalIntoCase').load('assets/html/editCompanyModal.html', function() {
			// Callback required!
			setTimeout(function() {
			// Vars
			var ModalContainerChildren = $('#loadModalIntoCase').children();
			var Modal = $('#editCustomerModal');
			var ModalContent = $('#editCustomerModal .modal-content');

			// Load Customer
			$("#editCustomerModal #CusID").text("#" + currentCustomer.CusID);
			$("#editCustomerModal #editCompanyName").val(currentCustomer.CusLastName);
			$("#editCustomerModal #editCustomerContact").val(currentCustomer.Contact);
			$("#editCustomerModal #editCustomerCell").val(currentCustomer.CusCell);
			$("#editCustomerModal #editCustomerWork").val(currentCustomer.CusWork);
			$("#editCustomerModal #editCustomerHome").val(currentCustomer.CusHome);
			$("#editCustomerModal #editCustomerFax").val(currentCustomer.CusFax);
			$("#editCustomerModal #editCustomerEmail1").val(currentCustomer.CusEmail_H);
			$("#editCustomerModal #editCustomerEmail2").val(currentCustomer.CusEmail_W);
			$("#editCustomerModal #editCustomerStreet1").val(currentCustomer.CusStreet1);
			$("#editCustomerModal #editCustomerCity").val(currentCustomer.CusCity);
			$("#editCustomerModal #editCustomerState").val(currentCustomer.CusState);
			$("#editCustomerModal #editCustomerZip").val(currentCustomer.CusZip);

			$('#editCustomerModal #submit').click(function() {
				$('#editCustomerModal .group input').each(function() {
					if (!($(this).val() == currentCustomer[$(this).data('for')]) && $(this).val() !== ' ') {
						var Column = $(this).data('for');
						$.post('hook.php', { function: 'updateCusColumn', searchArg: $(this).data('for'), CusID: currentCustomer.CusID, updatedValue: $(this).val() }, function(data) {
							data = JSON.parse(data);
							if (data.status !== '1') {
								$.alert({
									title: 'Opps!',
									content: 'An error occured while updating customer ' + Column,
									type: 'red',
									autoClose: 'close|6500',
									buttons: {
										close: function(){ }
									},
									theme: 'material',boxWidth: '500px',useBootstrap: false
								});
							}
						});
					}
				});

				setTimeout(function() { fetchCustomerByID(currentCustomer.CusID, 1); hideModal(); }, 100);
			});

			// Show/Hide Div
			$(Modal).show();
			$(window).click(function() {
				if (!$(ModalContent).is(event.target) && $(ModalContent).has(event.target).length === 0) { hideModal(); }
			});
			$(document).keyup(function(e) {
				if (e.keyCode == 27) { hideModal(); }
			});
			function hideModal() {
				$(ModalContainerChildren).remove();
				$(window).off('click');
				$(document).off('keyup');
			}
			}, 100);
		});
	}
});
}

/*********************************************************************/
/*								     */
/*			    PUBLIC FUNCTIONS		             */
/*								     */
/*********************************************************************/
// Check if string is empty
function isEmpty(str){
    return str === null || str.match(/^ *$/) !== null;
}

// Shorten without cutting Words
function shortenString(str, length)
{
	var trimmedString = str.substr(0, length);
	return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
}

// Remove () -
function stripNumber(num)
{
	return num.replace(/[^0-9]/g, "");
}

// Add Dashes
function addDashes(f)
{
    f_val = f.replace(/[^0-9]/g, "");
    return f_val.slice(0,3)+"-"+f_val.slice(3,6)+"-"+f_val.slice(6);
}

// Phonetic Function
function getPhonetic(str)
{
	nato = '';
	for (var i = 0, len = str.length; i < len; i++) { nato += ch2nato(str[i]); }
	if (nato[nato.length -1] === '-') { return nato.substring(0, nato.length-1); } else { return nato; }
}

// Nato Function
function ch2nato(ch)
{
	switch (ch.toLowerCase()) {
		case "a": return "ALPHA-";
		case "b": return "BRAVO-";
		case "c": return "CHARLIE-";
		case "d": return "DELTA-";
		case "e": return "ECHO-";
		case "f": return "FOXTROT-";
		case "g": return "GOLF-";
		case "h": return "HOTEL-";
		case "i": return "INDIA-";
		case "j": return "JULIET-";
		case "k": return "KILO-";
		case "l": return "LIMA-";
		case "m": return "MIKE-";
		case "n": return "NOVEMBER-";
		case "o": return "OSCAR-";
		case "p": return "PAPA-";
		case "q": return "QUEBEC-";
		case "r": return "ROMEO-";
		case "s": return "SIERRA-";
		case "t": return "TANGO-";
		case "u": return "UNIFORM-";
		case "v": return "VICTOR-";
		case "w": return "WHISKEY-";
		case "x": return "XRAY-";
		case "y": return "YANKEE-";
		case "z": return "ZULU-";
		default: return ch +"-";
	}
}

// Mileage Service Rec
function getServiceRec(mileage)
{
	// Round, Service Rec
	var x = Math.round(mileage);
	var r = [];
	// Recommendation Generator
	if (x < 100000) {
		r.push('6,000mi / 6 Month Oil Change Interval');
		r.push('75,000mi / 6 Year Transmission Service Interval');
	} else {
		r.push('3,000mi / 3 Month Oil Change Interval');
		r.push('30,000mi Transmission Service');
		r.push('100,000mi Spark Plug Replacement');
		r.push('105,000mi Water Pump, Timing Belt Replacement?');
	}

	// Return Recommendations
	return r;
}
