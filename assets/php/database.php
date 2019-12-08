<?php
// Connect to database
$con = mysqli_connect("localhost","test_ACCT","4kR((JKmD.?)","test_DB");

// Check connection
if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	die();
}
?>
