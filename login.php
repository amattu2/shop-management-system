<?php
session_start();
if (isset($_SESSION['username'])) {
    die(header("location: index.php"));
}
?>

<!DOCTYPE html>
<html>
	<head>
		<!-- Title, Meta, Etc -->
		<title>Login - Tools</title>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<!-- Styles -->
		<link rel="stylesheet" type="text/css" href="assets/css/index.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
		<link href="login/css/main.css" rel="stylesheet" media="screen">
		<!-- Pre Scripts -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	</head>

	<body>
		<div class='navbar'>
			<div class='title'>
				<h2 id='title'>Login</h2>

			</div>
		</div>

		<div class='sidebar'>
			<div class='link active' id='invoice-btn' data-title="Invoice" title='Invoice'>
				<div class='hover'>
					<i class="fa fa-sign-in fa-2x"></i>
				</div>
			</div>

		</div>

		<div class='bodyContainer' id='container'>
			<form class="form-signin" name="form1" method="post" action="checklogin.php">
				<h2 class="form-signin-heading">Please sign in</h2>
				<input name="myusername" id="myusername" type="text" class="form-control" placeholder="Username" autofocus>
				<br />
				<input name="mypassword" id="mypassword" type="password" class="form-control" placeholder="Password">

				<button name="Submit" id="submit" class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>

				<div id="message"></div>
			</form>
		</div>

		<!-- Scripts -->
		<script>
			localStorage.clear();
		</script>
		<script src="login/js/login.js"></script>
	</body>
</html>
