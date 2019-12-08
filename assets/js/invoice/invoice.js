$(document).ready(function() {
	// Load Packages
	if (Lockr.get('invoicePackages') !== undefined) {
			packages = Lockr.get('invoicePackages');
			for (var i = 0; i < packages.length; i++) {
				var pkg = packages[i];
				var pkgDiv = $("<div class='package' data-pkg='"+ pkg.ID +"'>" + pkg.ShortDesc + "</div>");
				$('#package-bar').append(pkgDiv);
				$('#package-bar').append("<div class='sep'></div>");
			}
			// Assign Onclick
			$('.package').each(function() {
				$(this).click(function() { addPackageByID($(this).data('pkg')); });
			});
	} else {
		$.post("hook.php", { function: 'getAllPackages' }, function(data) {
			var PkgArray = Array();
			packages = JSON.parse(data);
			for (var i = 0; i < packages.length; i++) {
				var pkg = packages[i];
				var pkgDiv = $("<div class='package' data-pkg='"+ pkg.ID +"'>" + pkg.ShortDesc + "</div>").click(function(){ hidePackages(); });
				$('#package-bar').append(pkgDiv);
				$('#package-bar').append("<div class='sep'></div>");
				PkgArray.push(pkg);
			}
			// Push Array
			Lockr.set('invoicePackages', PkgArray);
			// Assign Onclick
			$('.package').each(function() {
				$(this).click(function() { addPackageByID($(this).data('pkg')); });
			});
		});
	}

	// Load Invoices
	if (Lockr.get('recentInvoices') !== undefined) {
		var data = Lockr.get('recentInvoices');
		try {
		for (var i = 0; i < data.length; i++) {
			var EstNum = data[i].EstNum;
			$('#invoice-body').append($("<tr data-estnum='"+ EstNum +"'><td class='text estdate'>"+ moment(data[i].EstDate, "MM/D/YYYY HH:mm").format("MM/D/YY") +"</td><td class='text'>"+ data[i].FirstName  +" "+ data[i].LastName +"</td><td class='estdesc'>"+ data[i].EstDesc.substring(0,30) +"</td></tr>").click(function() { BuildInvoiceByEstNum($(this).data('estnum')); hideInvoices(); }) );
		}
		} catch(e) {}
	} else {
		$.post("hook.php", { function: 'getOpenInvoices' }, function(data) {
			recentInvoices = Array();
			try { data = JSON.parse(data); } catch(e) { }
			for (var i = 0; i < data.length; i++) {
				var EstNum = data[i].EstNum;
				$('#invoice-body').append($("<tr data-estnum='"+ EstNum +"'><td class='text estdate'>"+ moment(data[i].EstDate, "MM/D/YYYY HH:mm").format("MM/D/YY") +"</td><td class='text'>"+ data[i].FirstName  +" "+ data[i].LastName +"</td><td class='estdesc'>"+ data[i].EstDesc.substring(0,30) +"</td></tr>").click(function() { BuildInvoiceByEstNum($(this).data('estnum')); hideInvoices(); }) );
				recentInvoices.push(data[i]);
			}
			Lockr.set('recentInvoices', recentInvoices);
		});
	}


	// Package/Invoice Toggler
	$('#packageToggle').on('click', function() {
		if ($(this).data('open')) {
			hidePackages();
		} else {
			showPackages();
		}
	});
	$('#invoiceToggle').on('click', function() {
		if ($(this).data('open')) {
			hideInvoices();
		} else {
			showInvoices();
		}
	});

	// Hide Packagebar/Invoicebar
	function hidePackages() {
		$(window).off('click');
		$('#package-bar').animate({left: '-550'}, '550');
		$('#packageToggle').animate({left: '80px'}, '550');
		$('#packageToggle').data('open', 0);
		$('.bodyCover').fadeOut();
	}
	function hideInvoices() {
		$(window).off('click');
		$('#invoice-bar').animate({left: '-550'}, '550');
		$('#invoiceToggle').animate({left: '80px'}, '550');
		$('#invoiceToggle').data('open', 0);
		$('.bodyCover').fadeOut();
	}

	// Show Packagebar/InvoiceBar
	function showPackages() {
		$('#package-bar').animate({left: '80px'}, '550').animate({scrollTop: '0'});
		$('#packageToggle').animate({left: '461px'}, '550');
		$('#packageToggle').data('open', 1);
		$('.bodyCover').fadeIn();
		setTimeout(function() {
			$(window).click(function() {
				if (!$('#package-bar').is(event.target) && $('#package-bar').has(event.target).length === 0) { hidePackages(); }
			});
		}, 50);
	}
	function showInvoices() {
		$('#invoice-bar').animate({left: '80px'}, '550').animate({scrollTop: '0'});
		$('#invoiceToggle').animate({left: '561px'}, '550');
		$('#invoiceToggle').data('open', 1);
		$('.bodyCover').fadeIn();
		setTimeout(function() {
			$(window).click(function() {
				if (!$('#invoice-bar').is(event.target) && $('#invoice-bar').has(event.target).length === 0) { hideInvoices(); }
			});
		}, 50);
	}

	/*********************************************************************/
	/*								     */
	/*			    Exporting Section		             */
	/*								     */
	/*********************************************************************/
	// Export as PDF
	function expSave() {
		alert('pdf');
	}

	// Export as Print
	function expPrint() {
		window.print();
	}

	// Export as Email
	function expEmail() {
		alert('email');
	}

	// Assign Onclick
	$('#export-print').click(expPrint);
	$('#export-save').click(expSave);
	$('#export-email').click(expEmail);
	$('#saveInvoice').click(saveInvoice);
	$('#deleteInvoice').click(deleteInvoice);
	$('#edit-desc').click(editDesc);
	$('#edit-mileage').click(editMileage);
	$('#edit-notes').click(editNotes);
	$('#add-credit').click(addCredit);

	/*********************************************************************/
	/*								     */
	/*			    Invoicing Section		             */
	/*								     */
	/*********************************************************************/
	// Assign Toggle Button Onclicks
	$('#options-tax').on('change', totalInvoice);
	$('#options-misc').on('change', totalInvoice);
	$('#options-hazard').on('change', totalInvoice);
	$('#options-round').on('change', totalInvoice);

	// Current Invoice
	var currentInvoice = Array();

	// View Invoice
	if (getCookie("invoice_id")) {
		BuildInvoiceByEstNum(getCookie("invoice_id"));
		eraseCookie("invoice_id");
	} else if (getCookie("create_invoice")) {
		CreateNewInvoice(JSON.parse(getCookie("create_invoice")));
		eraseCookie("create_invoice");
	} else {
		showInvoices();
	}

	// Load Previous Invoice
	function BuildInvoiceByEstNum(id) {
		// Load Invoice Template
		document.title = 'Invoice #' + id + " -  Tools";
		$('.invoice-case').load("assets/html/invoice-template.html", function() {
			// Load Invoice Data
			$.post("hook.php", { function: 'getInvoiceByPrintedID', searchArg: id}, function(data) {
				invoice = JSON.parse(data)[0];
				i = invoice;

				// Update Current Invoice
				currentInvoice = invoice;

				// Update Template Invoice Info
				$('#invoice-number').text(currentInvoice.EstNum);
				if (invoice.EmployeeID !== null && invoice.EmployeeID !== '0') { $('#invoice-employeeID').text(invoice.EmployeeID); } else { $('#invoice-employeeID').text("N/A");  }
				$('#invoice-date').text(moment(invoice.EstDate, "MM/DD/YYYY HH:mm").format("MMM do, YYYY"));

				// Update Template Customer Info
				$('#customer-name').text(invoice.FirstName + " " + invoice.LastName);
				$('#customer-addr1').text(invoice.Street1);
				$('#customer-addr2').text(invoice.City +", "+ invoice.State +" "+ invoice.Zip);
				$('#customer-cell').text(invoice.Cell);
				$('#customer-home').text(invoice.Home);
				$('#customer-work').text(invoice.Work);

				// Update Template Vehicle Info
				$('#vehicle-year').text(invoice.ModYear);
				$('#vehicle-make').text(invoice.Make);
				$('#vehicle-model').text(invoice.Model);
				$('#vehicle-engine').text(invoice.EngDesc);
				$('#vehicle-vin').text(invoice.VIN);
				$('#vehicle-mileage').text(numeral(invoice.Mileage).format("0,0"));

				// Update Invoice Notes
				if (invoice.Notes.length >= 1) { $('#invoice-notes').text(invoice.Notes.trim()); }

				// Update Checkboxes
				if (parseInt(invoice.Total) == 0) { $("#options-hazard").prop("checked", false) } else { $("#options-hazard").prop("checked", true) }
				if (parseInt(invoice.Total) == 0) { $("#options-misc").prop("checked", false) } else { $("#options-misc").prop("checked", true) }
				if (parseInt(invoice.TaxExempt) == -1) { $("#options-tax").prop("checked", true) } else { $("#options-tax").prop("checked", false) }
				if (invoice.AutoRound == 1) { $("#options-round").prop("checked", true) } else { $("#options-round").prop("checked", false) }

				// Update Credits
				if (i.OilChangeCredit !== '0') {
					var amount = numeral(i.OilChangeCredit);
					$('#misc-list').append($("<tr class='item credit' data-price='"+ amount.format("0.00") +"'><td>Standard Oil Change Credit</td> <td>"+ amount.format("$0,0.00") +"</td></tr>"))
				}
				if (i.FreeOilChangeCredit !== '0') {
					var amount = numeral(i.FreeOilChangeCredit);
					$('#misc-list').append($("<tr class='item credit' data-price='"+ amount.format("0.00") +"'><td>Free Oil Change 1-Year Credit</td> <td>"+ amount.format("$0,0.00") +"</td></tr>"))
				}
				if (i.PreviousInvoiceCredit !== '0') {
					var amount = numeral(i.PreviousInvoiceCredit);
					$('#misc-list').append($("<tr class='item credit' data-price='"+ amount.format("0.00") +"'><td>Credit Per Previous Invoice</td> <td>"+ amount.format("$0,0.00") +"</td></tr>"))
				}
				if (i.ManagementCredit !== '0') {
					var amount = numeral(i.ManagementCredit);
					$('#misc-list').append($("<tr class='item credit' data-price='"+ amount.format("0.00") +"'><td>Credit Per  Automotive</td> <td>"+ amount.format("$0,0.00") +"</td></tr>"))
				}

				// Load Invoice Lines
				$.post("hook.php", { function: 'getInvoiceLinesByID', searchArg: currentInvoice.EstNum}, function(data) {
					try { lines = JSON.parse(data);
					for (var i = 0; i < lines.length; i++) {
						// Variables
						var line = lines[i];
						var quantity = numeral(line.Quantity);
						var price = numeral(line.Price);
						var total = numeral(line.Quantity * line.Price);

						try { var PartNo = line.PartNo; } catch(e) { PartNo = ''; }
						try { var JobDesc = line.JobDesc; } catch(e) { JobDesc = ''; }

						// Build Div
						var div = $("<tr class='item p-0'></tr>")
						var td = $("<td class='p-0'><table><td class='p-0 PartNo' style='width: 95px;'>"+ PartNo +"</td><td class='py-0 JobDesc' style='text-align: left; width: 494px;'>"+ JobDesc +"</td></table></td> <td class='p-0'><table><td class='p-0 Quantity' style='width: 49px;' data-quantity='"+ quantity.format("0.00") +"'>"+ quantity.format("0.00") +"</td><td style='width: 49px;' class='p-0 Price' data-price='"+ price.format("0.00") +"'>"+ price.format("$0,0.00") +"</td><td class='p-0 Total' style='text-align: right; width: 77px;' data-total='"+ total.format("0.00") +"'>"+ total.format("$0,0.00") +"</td></table></td>");

						// Append
						if (line.InvType === 'Labor' || line.InvType === '1' || !isNaN(line.InvType)) {
							$('#labor-list').prepend($(div).append($(td)));
						} else if (line.InvType === 'Parts') {
							$('#parts-list').prepend($(div).append($(td)));
						}
					}
					// Enable Editing
					enableEditing();
					} catch(e) {}
				});

				// Add up totals
				totalInvoice();
			});
		});
	}

	// Create New Invoice (Passed By Customer Page)
	function CreateNewInvoice(customerArray) {
		var CusID = customerArray.CusID;
		var CarID = customerArray.CarID;
		var loaded = 0;

		// Basic Info
		currentInvoice.EstDate = moment().format("MM/DD/YYYY H:mm");

		// Get Customer Info
		$.post("hook.php", { function: 'getCustomerByID', searchArg: CusID}, function(data) {
			// Parse
			try { customer = JSON.parse(data)[0]; } catch(e) { return false; }
			// Update Invoice Customer Section
			currentInvoice.CusID = customer.CusID;
			currentInvoice.LastName = customer.CusLastName;
			currentInvoice.FirstName = customer.CusFirstName;
			currentInvoice.Street1 = customer.CusStreet1;
			currentInvoice.City = customer.CusCity;
			currentInvoice.State = customer.CusState;
			currentInvoice.Zip = customer.CusZip;
			currentInvoice.Home = customer.CusHome;
			currentInvoice.Work = customer.CusWork;
			currentInvoice.Cell = customer.CusCell;

			// Load Invoice
			load();
		});

		// Get Car Info
		$.post("hook.php", { function: 'getVehicleByCarID', searchArg: CarID}, function(data) {
			// Parse
			try { vehicle = JSON.parse(data)[0]; } catch(e) { return false; }
			// Update Invoice Vehicle Section
			currentInvoice.ModYear = vehicle.ModYear;
			currentInvoice.Make = vehicle.Make;
			currentInvoice.Model = vehicle.Model.trim();
			currentInvoice.CarDesc = vehicle.CarDesc;
			currentInvoice.EngDesc = vehicle.EngDesc;
			currentInvoice.Tag = vehicle.Tag;
			currentInvoice.Mileage = vehicle.Mileage;
			currentInvoice.VIN = vehicle.VIN;
			currentInvoice.Truck = vehicle.Truck;
			currentInvoice.CarId = vehicle.CarId;
			// Load Invoice
			load();
		});

		// Load Invoice Case
		function load() {
			// Check If Content Is Loaded
			if (loaded++ != 2) { loaded++; return false; }

			// Build Invoice
			$('.invoice-case').load("assets/html/invoice-template.html", function() {
				// Update Internal Variable
				invoice = currentInvoice;

				// Update Template Invoice Info
				$('#invoice-number').text("Estimate");
				if (invoice.EmployeeID !== null && invoice.EmployeeID !== '0') { $('#invoice-employeeID').text(invoice.EmployeeID); } else { $('#invoice-employeeID').text("N/A");  }
				$('#invoice-date').text(moment(invoice.EstDate, "MM/DD/YYYY HH:mm").format("MMM do, YYYY"));

				// Update Template Customer Info
				$('#customer-name').text(invoice.FirstName + " " + invoice.LastName);
				$('#customer-addr1').text(invoice.Street1);
				$('#customer-addr2').text(invoice.City +", "+ invoice.State +" "+ invoice.Zip);
				$('#customer-cell').text(invoice.Cell);
				$('#customer-home').text(invoice.Home);
				$('#customer-work').text(invoice.Work);

				// Update Template Vehicle Info
				$('#vehicle-year').text(invoice.ModYear);
				$('#vehicle-make').text(invoice.Make);
				$('#vehicle-model').text(invoice.Model);
				$('#vehicle-engine').text(invoice.EngDesc);
				$('#vehicle-vin').text(invoice.VIN);
				$('#vehicle-mileage').text(numeral(invoice.Mileage).format("0,0"));

				// Enable Editing
				enableEditing();

				// Debug
				console.log(currentInvoice);
			});
		}
	}

	/*********************************************************************/
	/*								     */
	/*			    Package Section		             */
	/*								     */
	/*********************************************************************/
	// Add Package To Invoice
	function addPackageByID(id) {
		$.post("hook.php", { function: 'getPackageItemsByID', searchArg: id}, function(data) {
			lines = JSON.parse(data);
			for (var i = 0; i < lines.length; i++) {
				line = lines[i];
				// Variables
				var line = lines[i];
				var quantity = numeral(line.Hours);
				var price = numeral(line.Price);
				var total = numeral(line.Hours * line.Price);

				try { var PartNo = line.PartNo; } catch(e) { PartNo = ''; }
				try { var JobDesc = line.JobDesc; } catch(e) { JobDesc = ''; }

				// Build Div
				var div = $("<tr class='item p-0'></tr>")
				var td = $("<td class='p-0'><table><td class='p-0 PartNo' style='width: 95px;'>"+ PartNo +"</td><td class='py-0 JobDesc' style='text-align: left; width: 494px;'>"+ JobDesc +"</td></table></td> <td class='p-0'><table><td class='p-0 Quantity' style='width: 49px;' data-quantity='"+ quantity.format("0.00") +"'>"+ quantity.format("0.00") +"</td><td style='width: 49px;' class='p-0 Price' data-price='"+ price.format("0.00") +"'>"+ price.format("$0,0.00") +"</td><td class='p-0 Total' style='text-align: right; width: 77px;' data-total='"+ total.format("0.00") +"'>"+ total.format("$0,0.00") +"</td></table></td>");

				// Append
				if (line.InvType === 'Labor' || line.InvType === '1' || !isNaN(line.InvType)) {
					$('#labor-list').prepend($(div).append($(td)));
				} else if (line.InvType === 'Parts') {
					$('#parts-list').prepend($(div).append($(td)));
				}
				// Add up totals
				totalInvoice();
			}
			// Enable Editing
			enableEditing();
		});
	}

	/*********************************************************************/
	/*								     */
	/*			   Inv. Editing Section		             */
	/*								     */
	/*********************************************************************/
	// Event Dispatcher


	// Enable Line Editing
	var delete_lines = Array();
	function enableEditing() {
		$('td.PartNo, td.JobDesc, td.Quantity, td.Price').off('mousedown').css({'user-select': 'none'}).on({
			'mousedown': function(e) {
				var td = $(this);
				if (e.which == 1) {
					// Enable Editing
					$(this).css({'user-select': 'unset'}).prop('contenteditable', true).focus();
					$(td).off('keydown').keydown(function(e) {
						// Catch Tab
						if (e.keyCode == 9) {
							e.preventDefault();
							$(td).next().prop('contenteditable', true).focus();
							return;
						}
						// Catch Incorrect Numbers
						if ($(td).is('.Quantity, .Price')) {
							if (![8, 37, 39, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 190].includes(e.keyCode)) {e.preventDefault(); $(td).css({color: "#e74c3c"}); setTimeout(function() {$(td).css({color: "unset"})},350)}
						} else {
							if ($(td).text().length > 72 || e.keyCode == 13) { e.preventDefault(); $(td).css({color: "#e74c3c"}); setTimeout(function() {$(td).css({color: "unset"})},350)}
						}
					});
				} else if (e.which == 3) {
					// Catch Context Menu
					var item = $(td).closest("tr.item");
					$(item).bind('contextmenu', function(e) {
					    return false;
					});

					// Delete
					if ($(item).hasClass("line-toggled")) {
						$(item).removeClass("line-toggled");
						delete_lines.splice(delete_lines.indexOf($(item)), 1);
					} else {
						$(item).addClass("line-toggled");
						delete_lines.push($(item));
					}
				}
			},
			'blur': function() {
				// Disable Editing
				$(this).css({'user-select': 'none'}).prop('contenteditable', false).off('keypress');
				// Update Values
				if ($(this).is('.Quantity')) { $(this).data('quantity', numeral($(this).text()).format("0.0")); }
				if ($(this).is('.Price')) { $(this).data('price', numeral($(this).text()).format("0.0")); }
				// Total
				totalInvoice();
			}
		});

		// Add LABOR Line
		$('#labors .button-case .plus').off('click').click(function() {
			var div = $("<tr class='item p-0'></tr>")
			var td = $("<td class='p-0'><table><td class='p-0 PartNo' style='width: 95px;'> </td><td class='py-0 JobDesc' style='text-align: left; width: 494px;'>Labor Description</td></table></td> <td class='p-0'><table><td class='p-0 Quantity' style='width: 49px;' data-quantity='0'>0.00</td><td style='width: 49px;' class='p-0 Price' data-price='85.00'>$85.00</td><td class='p-0 Total' style='text-align: right; width: 77px;' data-total='85.00'>$85.00</td></table></td>");
			$('#labor-list').prepend($(div).append($(td)));
			enableEditing();
		});

		// Add PART Line
		$('#parts .button-case .plus').off('click').click(function() {
			var div = $("<tr class='item p-0'></tr>")
			var td = $("<td class='p-0'><table><td class='p-0 PartNo' style='width: 95px;'>Part No.</td><td class='py-0 JobDesc' style='text-align: left; width: 494px;'>Part Description</td></table></td> <td class='p-0'><table><td class='p-0 Quantity' style='width: 49px;' data-quantity='1'>1.00</td><td style='width: 49px;' class='p-0 Price' data-price='0.00'>0.00</td><td class='p-0 Total' style='text-align: right; width: 77px;' data-total='0.00'>$0.00</td></table></td>");
			$('#parts-list').prepend($(div).append($(td)));
			enableEditing();
		});

		// Remove Lines
		$('.button-case .minus').off('click').click(function() {
			$.each(delete_lines, function(i, item) {
				$(item).remove();
				totalInvoice();
			});
		});
	}
	/*********************************************************************/
	/*								     */
	/*			   Inv. Total Section		             */
	/*								     */
	/*********************************************************************/
	// Add up totals
	function totalInvoice() {
		// Delayed to prevent errors
		setTimeout(function() {
			// Variables (Totals)
			var total = numeral();
			var subTotal = numeral();
			var tax = numeral();

			// Variables (Parts, Misc, Etc)
			var laborTotal = numeral();
			var partTotal = numeral();
			var miscTotal = numeral();

			// Loop Through Items
			$("#labor-list").children(".item").each(function() {
				var lineCost = $(this).find(".Quantity").data('quantity') * $(this).find(".Price").data('price');
				$(this).find(".Total").text(numeral(lineCost).format("$0,0.00")).data('total', numeral(lineCost).format("0.00"));
				laborTotal.add(lineCost);
				total.add(lineCost);
			});
			$("#parts-list").children(".item").each(function() {
				var lineCost = $(this).find(".Quantity").data('quantity') * $(this).find(".Price").data('price');
				$(this).find(".Total").text(numeral(lineCost).format("$0,0.00")).data('total', numeral(lineCost).format("0.00"));
				partTotal.add(lineCost);
				total.add(lineCost);
			});
			$("#misc-list").children(".credit").each(function() {
				var lineCost = $(this).data('price');
				total.add(lineCost);
			});


			// Misc Fee Amount
			$('#miscfee').remove();
			if (partTotal.value() > 0 && miscAmount(partTotal.value()) !== false) {
				var misc = numeral(miscAmount(partTotal.value()));
				total.add(misc.value());
				var div = $("<tr class='item p-0' id='miscfee'><td class='py-0'>Misc Shop Supplies, Cleaners, Lubricants</td> <td class='py-0'>"+ misc.format("$0,0.00") +"</td></tr>");
				$('#misc-list').append($(div));
			}

			// Hazard Fee
			$('#hazardfee').remove();
			if (partTotal.value() > 0 && hazardAmount(partTotal.value()) !== false) {
				var hazard = numeral(hazardAmount(partTotal.value()));
				total.add(hazard.value());
				var div = $("<tr class='item p-0' id='hazardfee'><td class='py-0'>Hazardous Waste Fee</td> <td class='py-0'>"+ hazard.format("$0,0.00") +"</td></tr>");
				$('#misc-list').append($(div));
			}

			// Tax
			if (taxAmount(partTotal.value()) !== false) {
				tax = numeral(taxAmount(partTotal.value()));
				total.add(tax.value());
			} else { $('#invoice-tax').text("$0.00"); }

			// Round Down
			$('#roundoff').remove();
			if (roundOff(total.value()) !== false) {
				var rounded = numeral(roundOff(total.value()));
				total.add(rounded.value());
				$("<tr class='item' id='roundoff'><td>Courtesy Round Down Credit of "+ rounded.format("$0.00") +"</td> <td>"+ rounded.format("$0.00") +"</td></tr>").insertAfter("#fees");
			}

			// Calculate Totals
			$('#invoice-subtotal').text(numeral(total.value() - tax.value()).format("$0.00"));
			$('#invoice-tax').text(tax.format("$0,0.00"));
			$("#invoice-total").text(total.format("$0,0.00"));
		}, 350);
	}

	// Misc Fee Rate
	function miscAmount(parts) {
		if ($("#options-misc").is(":checked")) {
			var misc = parts * 0.12;
			if (misc < 3.5) { misc = 3.5; }
			if (misc > 50) { misc = 50; }
			// Return
			currentInvoice.ServiceMisc = misc;
			return misc;
		} else {
			currentInvoice.ServiceMisc = 0;
			return false;
		}
	}

	// Hazardous Fee Rate
	function hazardAmount(parts) {
		if ($("#options-hazard").is(":checked")) {
			var hazard = parts * 0.05;
			if (hazard < 4) { hazard = 4; }
			if (hazard > 30) { hazard = 30; }
			// Return
			currentInvoice.ServiceHazard = hazard;
			return hazard;
		} else {
			currentInvoice.ServiceHazard = 0;
			return false;
		}
	}

	function taxAmount(total) {
		if (!$("#options-tax").is(":checked") && total >= 1.00) {
			currentInvoice.TaxExempt = -1;
			return total * 0.06;
		} else {
			if ($("#options-tax").is(":checked")) { currentInvoice.TaxExempt = 1; }
			return false;
		}
	}

	// Round Down Credit
	function roundOff(total) {
		if ($("#options-round").is(":checked")) {
			var invoiceTotal = numeral().subtract(numeral(total).difference(Math.floor(numeral(total).value())));
			currentInvoice.AutoRound = 1;
			if (invoiceTotal.value() !== 0) { return invoiceTotal; } else { return false; }
		} else {currentInvoice.AutoRound = 0; return false;}
	}

	/*********************************************************************/
	/*								     */
	/*		          Editing Inv. Section		             */
	/*								     */
	/*********************************************************************/
	// Edit Description
	function editDesc() {
		// Verify Invoice Is Built
		if (!currentInvoice.EstNum) { return false; }
		$.confirm({
			title: 'Invoice Description',
			content: '<input type="text" placeholder="Enter the invoice description" id="inv-desc" class="form-control" onkeyup="descLength(this)" value="'+ currentInvoice.UserDesc +'" required />',
			buttons: {
				formSubmit: {
					text: 'Update',
					action: function () {
						// Check Desc Length
						var desc = this.$content.find('#inv-desc').val().trim();
						if (desc.length < 2 || desc.length > 31) {
							$.alert({title: 'Opps!',content: 'Enter a valid description (2-31 Characters)',type: 'red',theme: 'material',boxWidth: '250px',backgroundDismiss: true,useBootstrap: false});
							return false;
						} else {
							// Update Description
							currentInvoice.UserDesc = desc;
						}
					}
				},
				cancel: function () {}
			},
			theme: 'material', boxWidth: '500px', useBootstrap: false
		});
	}

	// Edit Mileage
	function editMileage() {
		// Verify Invoice Is Built
		if (!currentInvoice.EstNum) { return false; }
		$.confirm({
			title: 'Edit Mileage',
			content: '<input type="text" placeholder="Enter the vehicle mileage" id="veh-mileage" class="form-control" onkeyup="mileageInput(this)" value="'+ currentInvoice.Mileage +'" required />',
			buttons: {
				formSubmit: {
					text: 'Update',
					action: function () {
						// Check Mileage Length
						var mileage = this.$content.find('#veh-mileage').val().trim();
						if (mileage.length < 1 || mileage.length > 7) {
							$.alert({title: 'Opps!',content: 'Enter valid mileage (1-7 Characters)',type: 'red',theme: 'material',boxWidth: '250px',backgroundDismiss: true,useBootstrap: false});
							return false;
						} else {
							// Update Description
							currentInvoice.Mileage = mileage;
							$('#vehicle-mileage').text(numeral(mileage).format("0,0"));
						}
					}
				},
				cancel: function () {}
			},
			theme: 'material', boxWidth: '500px', useBootstrap: false
		});
	}

	// Edit Notes
	function editNotes() {
		// Verify Invoice Is Built
		if (!currentInvoice.EstNum) { return false; }
		$.confirm({
			title: 'Invoice Notes',
			content: '<textarea placeholder="Enter the invoice notes" id="inv-notes" class="form-control" onkeyup="notesLength(this)" style="height: 107px;" required>'+ currentInvoice.Notes +'</textarea>',
			buttons: {
				formSubmit: {
					text: 'Update',
					action: function () {
						// Check Desc Length
						var notes = this.$content.find('#inv-notes').val().trim();
						if (notes.length < 1 || notes.length > 1024) {
							currentInvoice.Notes = '';
							$('#invoice-notes').text(notes);
						} else {
							// Update Description
							currentInvoice.Notes = notes;
							$('#invoice-notes').text(notes);
						}
					}
				},
				cancel: function () {}
			},
			theme: 'material', boxWidth: '500px', useBootstrap: false
		});
	}

	// Add Credit
	function addCredit() {
		// Verify Invoice Is Built
		if (!currentInvoice.EstNum) { return false; }
		$.confirm({
			title: 'Add Credit',
			content: '<select id="credit-desc" class="form-control" style="width: calc(77% - 30px);display: inline-block;height:48px;" onkeyup="this.value.substring(0,45)"required><option value="OilChangeCredit">Oil Change Credit</option><option value="FreeOilChangeCredit">Free Oil Change 1-Year Credit</option><option value="PreviousInvoiceCredit">Credit Per Previous Invoice</option><option value="ManagementCredit">Credit Per  Automotive</option></select><input type="number" step="0.5" min="0" value="13" id="credit-amount" class="form-control" style="width:calc(19% - 30px);margin: 0 14px;display:inline-block;" required />',
			buttons: {
				formSubmit: {
					text: 'Add',
					action: function () {
						// Check Desc Length
						var creditType = this.$content.find('#credit-desc').val();
						var creditDesc = this.$content.find('#credit-desc option:selected').text();
						var creditVal = this.$content.find('#credit-amount').val().trim();
						var creditValNumeral = numeral(0).subtract(creditVal);
						if ((creditDesc.length > 1 || creditDesc.length < 45) && creditVal > 1) {
							$('#misc-list').append($("<tr class='item credit' data-creditType='"+creditType+"' data-price='"+ creditValNumeral.format("0.00") +"'><td>"+ creditDesc +"</td> <td>"+ creditValNumeral.format("$0,0.00") +"</td></tr>"));
							currentInvoice[creditType] = creditVal;
							totalInvoice();
						}
					}
				},
				cancel: function () {}
			},
			theme: 'material', boxWidth: '500px', useBootstrap: false
		});
	}

	/*********************************************************************/
	/*								     */
	/*			 Saving/Deleting Section                     */
	/*								     */
	/*********************************************************************/
	// Save Invoice
	function saveInvoice() {
		// Verify Invoice Is Built
		if (!currentInvoice.EstNum) { return false; }

		// Prompt to Verify
		$.confirm({
			title: 'Save Invoice #' + currentInvoice.EstNum + '?',
			content: 'This overwrites all previous changes and can <b>not</b> reversed',
			type: 'green',
			buttons: {
				save: {
					action: function() {
						// No Desc
						if (currentInvoice.UserDesc.trim().length < 2) {
							editDesc();
						} else {
							// Update Details
							currentInvoice.EstDate = moment().format("MM/DD/YYYY H:mm");

							// Labor Lines
							var Lines = Array();
							$("#labor-list").children(".item").each(function() {
								labor = Array();
								labor.PartNo = $(this).find(".PartNo").text();
								labor.JobDesc = $(this).find(".JobDesc").text();
								labor.Quantity = $(this).find(".Quantity").data('quantity');
								labor.Price = $(this).find(".Price").data('price');
								labor.Total = $(this).find(".Total").data('total');
								labor.InvType = "Labor";
								Lines.push(labor);
							});

							// Parts
							var PartLines = Array();
							$("#parts-list").children(".item").each(function() {
								part = Array();
								part.PartNo = $(this).find(".PartNo").text();
								part.JobDesc = $(this).find(".JobDesc").text();
								part.Quantity = $(this).find(".Quantity").data('quantity');
								part.Price = $(this).find(".Price").data('price');
								part.Total = $(this).find(".Total").data('total');
								part.InvType = "Parts";
								Lines.push(part);
							});

							// Post To DB
							console.log(Lines);
							console.log(currentInvoice);
						}
					}
				},
				cancel: { }
			},
			theme: 'material', boxWidth: '500px', useBootstrap: false
		});
	}

	// Delete Invoice
	function deleteInvoice() {
		// Verify Invoice Is Built
		if (!currentInvoice.EstNum) { return false; }
		// Prompt to Verify
		$.confirm({
			title: 'Delete Invoice #' + currentInvoice.EstNum + '?',
			content: 'This deletes all invoice data and can <b>not</b> reversed',
			type: 'red',
			buttons: {
				delete: {
					btnClass: 'btn-red',
					action: function() {

						$.post("hook.php", { function: 'deleteInvoiceByID', searchArg: currentInvoice.EstNum}, function(data) {
							try { data = JSON.parse(data) } catch(e) {}
							if (data.status == 1) {
								Lockr.rm('recentInvoices');
								$('.invoice-box').animate({opacity: '0.5'}, 150);
								$("#invoice-body [data-estnum="+ currentInvoice.EstNum +"]").remove();
								currentInvoice = '';
							}
						});

					}
				},
				cancel: { }
			},
			theme: 'material', boxWidth: '500px', useBootstrap: false
		});
	}

	/*********************************************************************/
	/*								     */
	/*			    Bottombar Section		             */
	/*								     */
	/*********************************************************************/
	// Bottom Bar Buttons
	$('.bottom-bar .button').click(function() {
		// Remove Other Classes
		$('.button.showing').removeClass('showing');
		// Show Button
		$(this).addClass('showing');
		var btn = $(this);
		// Add Off Click
		$(document).mouseup(function(e) {
			if (!$(btn).is(e.target) && $(btn).has(e.target).length == 0) { $(btn).removeClass('showing'); $(document).off('mouseup'); }
		});
	});
});

/*********************************************************************/
/*								     */
/*			Minor Functions Section		             */
/*								     */
/*********************************************************************/

// Max Invoice Desc Input
function descLength(element) {
	if (element.value.length >= 30) {
		element.value = element.value.substring(0,30);
	}
}

// Trim All But Numbers
function mileageInput(element) {
	element.value = element.value.replace(/\D/g,'').substring(0,7);
}

// Max Invoice Notes Length
function notesLength(element) {
	if (element.value.length >= 1024) {
		element.value = element.value.substring(0,1024);
	}
}
