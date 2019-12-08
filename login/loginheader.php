<?php
session_start();
if (!isset($_SESSION['username'])) {
	die(header("location: login.php"));
}
