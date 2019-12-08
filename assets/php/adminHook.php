<?php
// Verify Auth
require("../../login/loginheader.php");
if ($_SESSION['AuthLevel'] != 2) { die(); }

// Variables
$func = $_POST['function'];
if (isset($_POST['searchArg'])) {
	$p = $_POST['searchArg'];
}

// Function Calls
if ($func == 'fetchAllUsers') {
	echo json_encode(fetchAllUsers());

} else if ($func == 'createUser' && isset($p)) {
	echo createUser($p);

} else if ($func == 'activateUser' && isset($p)) {
	activateUser($p);

} else if ($func == 'deactivateUser' && isset($p)) {
	deactivateUser($p);

} else if ($func == 'fetchUserByID' && isset($p)) {
	echo json_encode(fetchUserByID($p));

} else if ($func == 'fetchAttemptiveLogins') {
	echo json_encode(fetchAttemptiveLogins());
}

// User Fetch Functions
function fetchAllUsers() {
	// Start Connection
	require("database.php");
	$query = "SELECT id, IP, username, name, AuthLevel, email, verified FROM user_Accounts ORDER BY AuthLevel DESC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function fetchUserByID($id) {
	// Start Connection
	require("database.php");
	$query = "SELECT id, IP, username, name, AuthLevel, email, verified FROM user_Accounts WHERE id = '$id'";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

// Activate/Deactivate User
function activateUser($id) {
	// Start Connection
	require("database.php");
	$query = "UPDATE user_Accounts SET verified = '1' WHERE id = '$id'";
	$result = mysqli_query($con, $query);
	mysqli_close($con);
}

function deactivateUser($id) {
	// Start Connection
	require("database.php");
	$query = "UPDATE user_Accounts SET verified = '0' WHERE id = '$id'";
	$result = mysqli_query($con, $query);
	mysqli_close($con);
}

// Create User functions
function createUser($p) {
	// Build User
	$ip = $_SERVER['REMOTE_ADDR'];
	$user = json_decode($p, 1);
	$name = $user["name"];
	$initials = $user["initials"];
	$username = $user["username"];
	$email = $user["email"];
	$pass = password_hash($user["password"], PASSWORD_DEFAULT);
	$memo = "Welcome to your personal notepad, $name";
	// Check
	if (empty($name) || empty($username) || empty($email) || empty($pass)) { return false; }
	// Add User
	require("database.php");
	$query = "INSERT INTO user_Accounts (`IP`, `username`, `name`, `initials`, `password`, `email`, `verified`, `memo`) VALUES ('$ip','$username','$name', '$initials', '$pass','$email', '0', '$memo')";
	$result = mysqli_query($con, $query);
	if (mysqli_affected_rows($con) > 0) { return 'true'; } else { return 'false'; }
	mysqli_close($con);
}

// Loging Functions
function fetchAttemptiveLogins() {
	// Start Connection
	require("database.php");
	$query = "SELECT IP, Attempts, LastLogin, Username FROM user_Attempts ORDER BY 'ID' DESC LIMIT 4";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}
?>
