jQuery.fn.extend({
	// Create Required Elements
	notifystart: function() {
		return this.each(function() {
			// Make Element Group Element
			$("body").append("<div class='notify-group'></div>");
		});
	},	
	// Type [Warning, Info, Success] || Time [In Seconds] || Text [Any Text]
	notify: function(type, time, text) {
		var idn = "notify-" + Math.floor(Math.random() * 200);
		return this.each(function() {
			// Make Element
			$(".notify-group").prepend("<div id='" + idn + "' class='notify " + type + "'><p>" + text + "</p></div>");
			// Onclick Remove
			$("#" + idn).on('click', function() {
				$(this).animate({left: '550px'}, "slow", function(){ $(this).remove(); });
			});
			// Element Removal
			if (time > 0) {
				setTimeout(function(){ $("#" + idn).animate({left: '550px'}, "slow", function(){ $(this).remove(); }); }, time);
			}
		});
	},
	notifyclear: function() {
		return this.each(function() {
			// Remove Each Element
			$(".notify").each(function(index) {
				$(this).animate({left: '550px'}, 600 * index, function(){ $(this).remove(); });
			});
		});
	},		
});