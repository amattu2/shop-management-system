$(document).ready(function() {
	/* ------------------- */
	// Load Dash
	loadPage("Dashboard", "dashboard.html")
	$('#dashboardBtn').addClass('active');

	// ---- Setup Page ----
	$('.sidebar .link').each(function() {
		$(this).on('click', function() {
			if (!$(this).hasClass('active')) {
				// Adj. Previous Links
				$('.sidebar .active').each(function() {
					$(this).removeClass('active');
				});

				// Load New Page
				loadPage($(this).data('title'), $(this).data('target'));
				$(this).addClass('active');
			}
		});
	});

	// Extra Button
	$('#extra-btn').off('click').click(function() {
		var ex = $("<div class='extra-modal'></div>");
		$(ex).load("pages/extra.html", function() {
			$(this).css({opacity: 0}).insertBefore('#container').animate({opacity: '1'});
			setTimeout(function() {
				$(window).click(function() {
					if (!$('.extra-modal .case').is(event.target) && $('.extra-modal .case').has(event.target).length === 0) {
						$('.extra-modal').animate({opacity: '0'}, function() { $(this).remove(); });
						$(window).off('click');

					}
				});
			}, 50);
		});
	});

	// Settings Onclick
	$('#settingsBtn').click(function() {
		$('.sidebar .link.active').removeClass('active');
		loadPage("Settings", "settings.html", "0");
	});

	// Setup Nav Buttons
	$('#refreshBtn').click(function() {
		$(this).addClass('fa-spin');
		localStorage.clear();
		setTimeout(function() { $('#refreshBtn').removeClass('fa-spin'); loadPage(currentTitle, currentPage); }, 1000);
	});

	$('#logoutBtn').click(function() {
		location.href = 'login/logout.php';
	});

	// Notify User of Error
	window.onerror = function() {
		$.alert({
			title: 'Script Error',
			content: 'An internal error occured. This page might not operate as expected.',
			type: 'red',
			autoClose: 'close|6500',
			buttons: {
				close: function(){ }
			},
			theme: 'material',boxWidth: '500px',useBootstrap: false
		});
	};

	// Idle Tracker
	var idleTime = 0;
	var idleInterval = setInterval(timer, 60000);

	// Zero the idle timer on mouse movement.
	$(this).mousemove(function(e) {
		idleTime = 0;
	});
	$(this).keypress(function(e) {
		idleTime = 0;
	});

	function timer() {
		// Verify Account
		$.post("hook.php", { function: 'checkAccountAuth' }, function(data) {
			try { data = JSON.parse(data); } catch(e) {}
			if (data.verified == 0) { document.write('Invalid session'); location.href = 'login/logout.php'; }
		});

		// Login Timeout
		idleTime++;
		if (idleTime >= 20) {
			$.confirm({
				title: 'Are You There?',
				content: 'You will be logged out shortly due to inactivity',
				type: 'red',
				autoClose: 'logout|60000',
				buttons: {
					logout: { btnClass: 'btn-red', action: function() { document.write(''); location.href = 'login/logout.php'; } },
					cancel: { }
				},
				theme: 'material',boxWidth: '500px',useBootstrap: false
			});
		}
	}
});

// Loadpage Function
var currentPage = '';
var currentTitle = '';
function loadPage(title, page, cookie = null) {
	$(document).ready(function() {
			$('#container').animate({opacity: '0'}, {duration: "550", complete: function() {
				// Update Page
				$(".title #title").text(title);
				document.title = title + " -  Tools";
				// Load Page
				$('#container').load("pages/" + page, function() {
					$('#container').animate({opacity: "1"}, 550);
					currentPage = page;
					currentTitle = title;
				});
			}
		});
	});
}

// Cookie Functions
function setCookie(c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
	var i, x, y, ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == c_name) {
			return unescape(y);
		}
	}
}

function eraseCookie(name) { setCookie(name,"",-1) }


/* Lockr.js */
(function(root, factory) {

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = factory(root, exports);
    }
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      root.Lockr = factory(root, exports);
    });
  } else {
    root.Lockr = factory(root, {});
  }

}(this, function(root, Lockr) {
  'use strict';

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/)
    {
      var len = this.length >>> 0;

      var from = Number(arguments[1]) || 0;
      from = (from < 0)
      ? Math.ceil(from)
      : Math.floor(from);
      if (from < 0)
        from += len;

      for (; from < len; from++)
      {
        if (from in this &&
            this[from] === elt)
          return from;
      }
      return -1;
    };
  }

  Lockr.prefix = "";

  Lockr._getPrefixedKey = function(key, options) {
    options = options || {};

    if (options.noPrefix) {
      return key;
    } else {
      return this.prefix + key;
    }

  };

  Lockr.set = function (key, value, options) {
    var query_key = this._getPrefixedKey(key, options);

    try {
      localStorage.setItem(query_key, JSON.stringify({"data": value}));
    } catch (e) {
      if (console) console.warn("Lockr didn't successfully save the '{"+ key +": "+ value +"}' pair, because the localStorage is full.");
    }
  };

  Lockr.get = function (key, missing, options) {
    var query_key = this._getPrefixedKey(key, options),
        value;

    try {
      value = JSON.parse(localStorage.getItem(query_key));
    } catch (e) {
            if(localStorage[query_key]) {
              value = {data: localStorage.getItem(query_key)};
            } else{
                value = null;
            }
    }

    if(!value) {
      return missing;
    }
    else if (typeof value === 'object' && typeof value.data !== 'undefined') {
      return value.data;
    }
  };

  Lockr.sadd = function(key, value, options) {
    var query_key = this._getPrefixedKey(key, options),
        json;

    var values = Lockr.smembers(key);

    if (values.indexOf(value) > -1) {
      return null;
    }

    try {
      values.push(value);
      json = JSON.stringify({"data": values});
      localStorage.setItem(query_key, json);
    } catch (e) {
      console.log(e);
      if (console) console.warn("Lockr didn't successfully add the "+ value +" to "+ key +" set, because the localStorage is full.");
    }
  };

  Lockr.smembers = function(key, options) {
    var query_key = this._getPrefixedKey(key, options),
        value;

    try {
      value = JSON.parse(localStorage.getItem(query_key));
    } catch (e) {
      value = null;
    }

    return (value && value.data) ? value.data : [];
  };

  Lockr.sismember = function(key, value, options) {
    return Lockr.smembers(key).indexOf(value) > -1;
  };

  Lockr.keys = function() {
    var keys = [];
    var allKeys = Object.keys(localStorage);

    if (Lockr.prefix.length === 0) {
      return allKeys;
    }

    allKeys.forEach(function (key) {
      if (key.indexOf(Lockr.prefix) !== -1) {
        keys.push(key.replace(Lockr.prefix, ''));
      }
    });

    return keys;
  };

  Lockr.getAll = function (includeKeys) {
    var keys = Lockr.keys();

    if (includeKeys) {
      return keys.reduce(function (accum, key) {
        var tempObj = {};
        tempObj[key] = Lockr.get(key);
        accum.push(tempObj);
        return accum;
      }, []);
    }

    return keys.map(function (key) {
      return Lockr.get(key);
    });
  };

  Lockr.srem = function(key, value, options) {
    var query_key = this._getPrefixedKey(key, options),
        json,
        index;

    var values = Lockr.smembers(key, value);

    index = values.indexOf(value);

    if (index > -1)
      values.splice(index, 1);

    json = JSON.stringify({"data": values});

    try {
      localStorage.setItem(query_key, json);
    } catch (e) {
      if (console) console.warn("Lockr couldn't remove the "+ value +" from the set "+ key);
    }
  };

  Lockr.rm =  function (key) {
    var queryKey = this._getPrefixedKey(key);

    localStorage.removeItem(queryKey);
  };

  Lockr.flush = function () {
    if (Lockr.prefix.length) {
      Lockr.keys().forEach(function(key) {
        localStorage.removeItem(Lockr._getPrefixedKey(key));
      });
    } else {
      localStorage.clear();
    }
  };
  return Lockr;
}));
