<?php require "login/loginheader.php"; if (!isset($_SESSION['username'])) { die(); } ?>

<!DOCTYPE html>
<html>
	<head>
		<!-- Title, Meta, Etc -->
		<title>--Loading--</title>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<!-- Styles -->
		<link rel="stylesheet" type="text/css" href="assets/css/index.css">
		<link rel="stylesheet" href="assets/css/font-awesome.min.css">
		<link rel="stylesheet" href="assets/css/jquery-confirm.css">
		<!-- Pre Scripts -->
		<script src="assets/js/index/jquery.min.js"></script>
	</head>

	<body>
		<div class='navbar'>
			<div class='title'>
				<h2 id='title'>--Loading--</h2>

			</div>

			<div class='buttons'>
				<div id='accountName'><span><?php echo $_SESSION['name']; ?></span></div>
				<div class='btn' id='refreshBtn'>
					<i class="fa fa-refresh"></i>
				</div>
				<?php if ($_SESSION["AuthLevel"] == 2) { ?>
				<div class='btn' id='settingsBtn'>
					<i class="fa fa-ellipsis-v"></i>
				</div>
				<?php } ?>
				<div class='btn' id='logoutBtn'>
					<i class="fa fa-power-off"></i>
				</div>
			</div>
		</div>

		<div class='sidebar'>
			<div class='link' id='dashboardBtn' data-title="Dashboard" title='Dashboard' data-target="dashboard.html">
				<div class='hover'>
					<i class="fa fa-home fa-2x"></i>
				</div>
			</div>
			<div class='link' id='invoice-btn' data-title="Invoice" title='Invoice' data-target="invoice.html">
				<div class='hover'>
					<i class="fa fa-file-o fa-2x"></i>
				</div>
			</div>
			<div class='link' id='schedule-btn' data-title="Schedule" title='Schedule' data-target="schedule.html">
				<div class='hover'>
					<i class="fa fa-calendar-o fa-2x"></i>
				</div>
			</div>
			<div class='link' id='customers-btn' data-title="Customers" title='Customers' data-target="customers.html">
				<div class='hover'>
					<i class="fa fa-group fa-2x"></i>
				</div>
			</div>

			<div id='side-sep'></div>

			<?php if ($_SESSION["AuthLevel"] >= 1) { ?>
			<div class='link sm' id='requests-btn' data-title="Vehicle Requests" title='Vehicle Requests' data-target="requests.html">
				<div class='hover'>
					<i class="fa fa-search fa-1x"></i>
				</div>
			</div>
			<?php } ?>
			<div class='link sm' id='extra-btn' data-title="Extra" title='Extra' data-target='none'>
				<!--<span class='notification'>1</span>-->
				<div class='hover'>
					<i class="fa fa-info-circle fa-1x"></i>
				</div>
			</div>
		</div>

		<!-- Loaded -->
		<div class='container' id='container'></div>

		<!-- Scripts -->
		<script src='assets/js/index/index.js'></script>
		<script src="assets/js/index/jquery-confirm.js"></script>
	</body>
</html>
