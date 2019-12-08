// http://swisnl.github.io/jQuery-contextMenu/demo.html
$(document).ready(function() {
	$.contextMenu({
		selector: '.container .customer-info', 
		callback: function(key, options) {
			if (currentCustomer !== '' && currentCustomer !== 0 && currentCustomer !== null) {
				if (key == 'schedule') {
					// go to schedule page
				} else if (key == 'invoice') {
					// go to invoice page
				} else if (key == 'vehicle') {
					addVehicle();
				} else if (key == 'edit') {
					editCustomer();
				}
			}
		},
		items: {
			"schedule": {name: "Create Appointment", icon: "fa-calendar-plus-o"},
			"invoice": {name: "Create Invoice", icon: "fa-file-o"},
			"vehicle": {name: "Add Vehicle", icon: "fa-car"},
			"sep": "---------",	
			"edit": {name: "Edit Customer", icon: "fa-pencil"},		
			"delete": {
				"name": "Delete", 
				icon: "fa-trash",
				"items": {
					"softDelete": {name: "Soft Delete", icon: "fa-eye-slash"},
					"purge": {name: "Purge Customer", icon: "fa-ban", disabled: true}
				}
			}
		}
	});


        $('.context-menu-one').on('click', function(e){
            console.log('clicked', this);
        })    
})