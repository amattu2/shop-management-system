<?php
/*
	Definitions:
		- This file separates HTML pages from PHP pages
		- This file is not public
		- This file is locked from direct access via a private key
*/

/**** Login ****/
require "login/loginheader.php";
if (!isset($_SESSION['username'])) { die(); }

/**** Function Operator ****/
$function = $_POST['function'];
$searchArg = $_POST['searchArg'];

if ($function == 'getCustomerByID' && isset($searchArg)) {
	echo json_encode(getCustomerByID($searchArg));

} else if ($function == 'getCustomerByName' && isset($searchArg)) {
	echo json_encode(getCustomerByName($searchArg));

} else if ($function =='getAllCustomerNames') {
	echo json_encode(getAllCustomerNames());

} else if ($function == 'getAllInvoicesByCusID' && isset($searchArg)) {
	echo json_encode(getAllInvoicesByCusID($searchArg, 3));

} else if ($function == 'getAllFiles') {
	echo json_encode(getAllFiles());

} else if ($function == 'getAllMemos') {
	echo json_encode(getAllMemos());

} else if ($function == 'getAllVehiclesByCusID' && isset($searchArg)) {
	echo json_encode(getAllVehiclesByCusID($searchArg));

} else if ($function == 'getAllLogsByCusID' && isset($searchArg)) {
	echo json_encode(getAllLogsByCusID($searchArg));

} else if ($function == 'getVehicleByCarID' && isset($searchArg)) {
	echo json_encode(getVehicleByCarID($searchArg));

} else if ($function == 'getCusApptsByCusID' && isset($searchArg)) {
	echo json_encode(getCusApptsByCusID($searchArg, 3));

} else if ($function == 'getAllInvoicesByCarID' && isset($searchArg)) {
	echo json_encode(getAllInvoicesByCarID($searchArg));

} else if ($function == 'lockCusByID' && isset($searchArg)) {
	echo json_encode(lockCusByID($searchArg));

} else if ($function == 'softDeleteCusByID' && isset($searchArg)) {
	echo json_encode(softDeleteCusByID($searchArg));

} else if ($function == 'purgeCusByID' && isset($searchArg)) {
	echo json_encode(purgeCusByID($searchArg));

} else if ($function == 'getApptsByDate' && isset($searchArg)) {
	echo json_encode(getApptsByDate($searchArg));

} else if ($function == 'getAllPackages') {
	echo json_encode(getAllPackages());

} else if ($function == 'getPackageItemsByID' && isset($searchArg)) {
	echo json_encode(getPackageItemsByID($searchArg));

} else if ($function == 'getOpenRequests') {
	echo json_encode(getOpenRequests());

} else if ($function == 'getInvoiceByPrintedID' && isset($searchArg)) {
	echo json_encode(getInvoiceByPrintedID($searchArg));

} else if ($function == 'getInvoiceLinesByID' && isset($searchArg)) {
	echo json_encode(getInvoiceLinesByID($searchArg));

} else if ($function == 'getInvoiceCountByEmp' && isset($searchArg)) {
	echo json_encode(getInvoiceCountByEmp($searchArg));

} else if ($function == 'getAllScheduleServices') {
	echo json_encode(getAllScheduleServices());

} else if ($function == 'createCustomer' && isset($searchArg)) {
	echo json_encode(createCustomer($searchArg));

} else if ($function == 'updateCusColumn' && isset($searchArg) && isset($_POST['updatedValue']) && isset($_POST['CusID'])) {
	echo json_encode(updateCusColumn($searchArg, $_POST['updatedValue'], $_POST['CusID']));

} else if ($function == 'createAppt' && isset($searchArg)) {
	echo json_encode(createAppt($searchArg));

} else if ($function == 'updateAppPos' && isset($searchArg)) {
	echo json_encode(updateAppPos($searchArg));

} else if ($function == 'getUserScheduledAppts') {
	echo json_encode(getUserScheduledAppts($_SESSION['id']));

} else if ($function == 'getUserCreatedInvoices') {
	echo json_encode(getUserCreatedInvoices($_SESSION['id']));

} else if ($function == 'checkAccountAuth') {
	echo json_encode(checkAccountAuth($_SESSION['id']));

} else if ($function == 'getOpenInvoices') {
	echo json_encode(getOpenInvoices());

} else if ($function == 'checkForUpdatedApps' && isset($searchArg)) {
	echo json_encode(checkForUpdatedApps($searchArg));

} else if ($function == 'removeAppByID' && isset($searchArg)) {
	echo json_encode(removeAppByID($searchArg));

} else if ($function == 'getAppByID' && isset($searchArg)) {
	echo json_encode(getAppByID($searchArg));

} else if ($function == 'deleteInvoiceByID' && isset($searchArg)) {
	echo json_encode(deleteInvoiceByID($searchArg));

} else if ($function == 'createMemo' && isset($searchArg)) {
	echo json_encode(createMemo($searchArg));

} else if ($function == 'getAllLogs') {
	echo json_encode(getAllLogs());

} else if ($function == 'getCusApptStats' && isset($searchArg)) {
	echo json_encode(getCusApptStats($searchArg));

} else if ($function == 'getPersonalNotes') {
	echo json_encode(getPersonalNotes());

} else {
	echo false;
}


/*********************************************************************/
/*								     */
/*			    Customer Functions		             */
/*								     */
/*********************************************************************/
// Fetch Customer By ID
function getCustomerByID($id) {
	if (is_numeric($id)) {
		// Start Connection
		require("assets/php/database.php");
		$query = "SELECT * FROM Customers WHERE CusID = $id";
		$result = mysqli_query($con, $query);
		while ($row = mysqli_fetch_assoc($result))
		{
			$res[] = $row;
		}
		return $res;
		mysqli_close($con);
	} else { return false; }
}

function getCustomerByName($CusName) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT CusID, CusFirstName, CusLastName FROM Customers WHERE (CusLastName LIKE '%$CusName%') OR (CusFirstName LIKE '%$CusName%') ORDER BY CusLastName DESC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getAllCustomerNames() {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT CusID, CusFirstName, CusLastName FROM Customers WHERE isActive = 1 ORDER BY CusFirstName ASC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function createCustomer($cus) {
	$customer = json_decode($cus, true);
	$customerFirst = $customer["CusFirst"];
	$customerLast = $customer["CusLast"];

	if ($customer["company"] == 1) {
		require("assets/php/database.php");
		$query = "INSERT INTO Customers (`CusLastName`, `Company`) VALUES ('$customerLast','True')";
		$result = mysqli_query($con, $query);
		if (mysqli_affected_rows($con) > 0) { return $con->insert_id; } else { return false; }
		mysqli_close($con);
	} else if ($customer["company"] == 0) {
		require("assets/php/database.php");
		$query = "INSERT INTO Customers (`CusLastName`, `CusFirstName`, `Company`) VALUES ('$customerLast','$customerFirst', 'False')";
		$result = mysqli_query($con, $query);
		if (mysqli_affected_rows($con) > 0) { return $con->insert_id; } else { return false; }
		mysqli_close($con);
	} else {
		return false;
	}
}

function updateCusColumn($column, $value, $CusID) {
	if (is_numeric($CusID)) {
		require("assets/php/database.php");
		$query = "UPDATE Customers SET `$column` = '$value' WHERE CusID = $CusID";
		$result = mysqli_query($con, $query);
		if (mysqli_affected_rows($con) > 0) { createLog('Update', $CusID, $column, $value); return Array('status' => '1'); } else { return Array('status' => '0', 'message' => mysqli_error($con)); }
		mysqli_close($con);
	} else {
		return Array('status' => '0', 'message' => 'Not numeric');
	}
}
/*********************************************************************/
/*								     */
/*			    Invoice Functions		             */
/*								     */
/*********************************************************************/
function getAllInvoicesByCusID($id, $limit) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT EstNum, EstDesc, EstDate, ModYear, Model FROM Invoices WHERE CusID = $id AND isDeleted = '0' ORDER BY EstNum DESC LIMIT $limit";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getAllInvoicesByCarID($id) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT EstNum, EstDesc, EstDate, Total, Mileage, TicketType, Notes FROM Invoices WHERE CarId = $id AND isDeleted = '0' ORDER BY EstNum DESC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getInvoiceByPrintedID($id) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT * FROM Invoices WHERE EstNum = $id";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getInvoiceLinesByID($id) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT * FROM InvoiceItems WHERE EstNum = $id Order BY Total ASC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getInvoiceCountByEmp($id) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT EstNum FROM Invoices WHERE EmployeeID = $id AND isDeleted = '0'";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getUserCreatedInvoices($id) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT EstDate, Total, LastName FROM Invoices WHERE EmployeeID = $id AND isDeleted = '0' Order BY EstDate DESC LIMIT 20";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getOpenInvoices() {
	// Current Date
	$currentDate = date("Y-m-d");
	$lastDate = date("Y-m-d", strtotime("-1 month"));
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT EstNum, EstDesc, EstDate, FirstName, LastName FROM Invoices WHERE isDeleted = '0' AND (STR_TO_DATE(EstDate,'%m/%d/%Y %H:%i') between '$lastDate' AND '$currentDate') ORDER BY STR_TO_DATE(EstDate,'%m/%d/%Y %H:%i') DESC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function deleteInvoiceByID($id) {
	$EmployeeID = $_SESSION['id'];
	require("assets/php/database.php");
	$query = "UPDATE Invoices SET isDeleted = '1', EmployeeID = '$EmployeeID' WHERE EstNum = $id";
	$result = mysqli_query($con, $query);
	if (mysqli_affected_rows($con) > 0) { createLog('Delete', $id, 'Invoices', 'Removed Invoice ' . $id ); return Array('status' => '1'); } else { return Array('status' => '0', 'message' => mysqli_error($con)); }
}

/*********************************************************************/
/*								     */
/*		         ETC Data functions		             */
/*								     */
/*********************************************************************/
function getAllMemos() {
	require("assets/php/database.php");
	$query = "SELECT * FROM Memos WHERE NOW() < Expires ORDER BY Expires ASC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function createMemo($args) {
	$args = json_decode($args, true);
	$attn = $args['attn'];
	$message = $args['message'];
	$author = $_SESSION['name'];
	$expiration = $args['expiration'];
	require("assets/php/database.php");
	$query = "INSERT INTO Memos (`attn`, `message`, `author`, `Expires`) VALUES ('$attn',\"$message\", '$author', NOW() + INTERVAL $expiration DAY)";
	$result = mysqli_query($con, $query);
	if (mysqli_affected_rows($con) > 0) { createLog('Create', '', 'Memos', 'Created Memo'); return Array('status' => '1'); } else { return Array('status' => '0', 'message' => mysqli_error($con)); }
	mysqli_close($con);
}
/*********************************************************************/
/*								     */
/*			    VEHICLE FUNCTIONS		             */
/*								     */
/*********************************************************************/
function getAllVehiclesByCusID($id) {
	require("assets/php/database.php");
	$query = "SELECT CarId, ModYear, Make, Model, Truck FROM Vehicles WHERE CusID = $id ORDER BY ModYear DESC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getVehicleByCarID($id) {
	if (is_numeric($id)) {
		// Start Connection
		require("assets/php/database.php");
		$query = "SELECT * FROM Vehicles WHERE CarId = $id";
		$result = mysqli_query($con, $query);
		while ($row = mysqli_fetch_assoc($result))
		{
			$res[] = $row;
		}
		return $res;
		mysqli_close($con);
	} else { return false; }
}

/*********************************************************************/
/*								     */
/*			    SCHEDULE FUNCS		             */
/*								     */
/*********************************************************************/
function getCusApptsByCusID($id, $limit = null) {
	if (is_numeric($id)) {
		// Start Connection
		require("assets/php/database.php");
		if ($limit != null && is_numeric($limit)) { $query = "SELECT AppDate, AppTimeBegin, AppTimeLengthMin, AppServiceLabel FROM Schedule_Appts WHERE (AppCusID = $id AND AppStatus != 'deleted') Order BY AppID DESC LIMIT $limit"; } else { $query = "SELECT AppDate, AppTimeBegin, AppTimeLengthMin, AppServiceLabel FROM Schedule_Appts WHERE AppCusID = $id"; }
		$result = mysqli_query($con, $query);
		while ($row = mysqli_fetch_assoc($result))
		{
			$res[] = $row;
		}
		return $res;
		mysqli_close($con);
	} else { return false; }
}

function getApptsByDate($date) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT * FROM Schedule_Appts WHERE AppDate = '$date' Order BY AppTimeBegin+0 DESC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getAllScheduleServices() {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT * FROM Schedule_Services ORDER BY Sort ASC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function createAppt($appointment) {
	// Decode
	$app = json_decode($appointment, true);
	// Variables
	$AppCusID = $app["AppCusID"];
	$AppCusName = $app["AppCusName"];
	$AppPOC = $app["AppPOC"];
	$AppPOCNum = $app["AppPOCNum"];
	$AppDate = $app["AppDate"];
	$AppTimeBegin = $app["AppTimeBegin"];
	$AppTimeLengthMin = $app["AppTimeLengthMin"];
	$AppStatus = $app["AppStatus"];
	$AppServiceID = $app["AppServiceID"];
	$AppServiceLabel = $app["AppServiceLabel"];
	$AppNotes = $app["AppNotes"];
	$AppProviderID = $app["AppProviderID"];
	$AppVehicleID = $app["AppVehicleID"];
	$AppVehicleDesc = $app["AppVehicleDesc"];
	$AppReminder = $app["AppReminder"];
	$AppScheduledBy = $_SESSION['id'];
	$AppInitials = $_SESSION['initials'];
	// Connect to DB
	require("assets/php/database.php");
	$query = "INSERT INTO `Schedule_Appts` (`AppCusID`, `AppCusName`, `AppPOC`, `AppPOCNum`, `AppDate`, `AppTimeBegin`, `AppTimeLengthMin`, `AppStatus`, `AppServiceID`, `AppServiceLabel`, `AppNotes`, `AppProviderID`, `AppScheduledBy`, `AppVehicleID`, `AppVehicleDesc`, `AppReminder`, `AppScheduledByInitials`) VALUES ('$AppCusID', '$AppCusName', '$AppPOC', '$AppPOCNum', '$AppDate', '$AppTimeBegin', '$AppTimeLengthMin', '$AppStatus', '$AppServiceID', '$AppServiceLabel', '$AppNotes', '$AppProviderID', '$AppScheduledBy', '$AppVehicleID', '$AppVehicleDesc', '$AppReminder', '$AppInitials')";
	$result = mysqli_query($con, $query);
	if (mysqli_affected_rows($con) > 0) { createLog('Create', $AppCusID, 'Appointment', 'Created Appointment'); return Array('status' => '1'); } else { return Array('status' => '0', 'message' => mysqli_error($con)); }
	mysqli_close($con);
}

function updateAppPos($app) {
	$app = json_decode($app, true);
	$appID = $app["AppID"];
	$appTime = $app["AppTimeBegin"];
	$appProviderID = $app["AppProviderID"];
	$appDate = $app["AppDate"];

	// Start Connection
	require("assets/php/database.php");
	$query = "UPDATE Schedule_Appts SET AppTimeBegin = '$appTime', AppProviderID = '$appProviderID', AppDate = '$appDate' WHERE AppID = '$appID'";
	$result = mysqli_query($con, $query);
	if (mysqli_affected_rows($con) > 0) { createLog('Update', $appID, 'Appointment', $appDate); return Array('status' => '1'); } else { return Array('status' => '0', 'message' => mysqli_error($con)); }
	mysqli_close($con);
}

function getUserScheduledAppts($userid) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT AppDate, AppCusName FROM Schedule_Appts WHERE (AppScheduledBy = $userid AND AppStatus != 'deleted') Order BY AppID DESC LIMIT 20";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function checkForUpdatedApps($arg) {
	$array = json_decode($arg, true);
	$date = $array["date"];
	$currentLength = $array["currentLength"];

	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT AppDate FROM Schedule_Appts WHERE AppDate = '$date'";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result)) {
		$res[] = $row;
	}
	if (count($res) != $currentLength) { return 0; } else {	return 1; }
	mysqli_close($con);
}

function removeAppByID($id) {
	require("assets/php/database.php");
	$query = "UPDATE Schedule_Appts SET AppStatus = 'deleted' WHERE AppID = $id";
	$result = mysqli_query($con, $query);
	if (mysqli_affected_rows($con) > 0) { createLog('Delete', $id, 'Appointment', ''); return Array('status' => '1'); } else { return Array('status' => '0', 'message' => mysqli_error($con)); }
	mysqli_close($con);
}

function getAppByID($id) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT * FROM Schedule_Appts WHERE AppID = '$id'";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getCusApptStats($id) {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT AppDate, AppStatus, AppServiceLabel FROM Schedule_Appts WHERE AppCusID = '$id' AND (AppStatus='deleted' OR AppStatus='cancelled')";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}
/*********************************************************************/
/*								     */
/*			    INVOICE PACKAGES		             */
/*								     */
/*********************************************************************/
function getAllPackages() {
	require("assets/php/database.php");
	$query = "SELECT ID, ShortDesc FROM Packages ORDER BY Count DESC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getPackageItemsByID($id) {
	require("assets/php/database.php");
	$query = "SELECT PartNo, JobDesc, Hours, Price, Total, InvType FROM PackageItems WHERE PkgID = $id ORDER BY Price ASC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}


/*********************************************************************/
/*								     */
/*			  VEHICLE REQUEST FUNCS		             */
/*								     */
/*********************************************************************/
function getOpenRequests() {
	require("assets/php/database.php");
	$query = "SELECT ID, Name, Email, Year, Make, Date FROM Requests WHERE Submitted = '1' ORDER BY Date DESC";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

/*********************************************************************/
/*								     */
/*		  DATA DELETION / MANIPULATION		             */
/*								     */
/*********************************************************************/
function softDeleteCusByID($id) {
	if (is_numeric($id) && $_SESSION['AuthLevel'] >= 1) {
		// Start Connection
		require("assets/php/database.php");
		$query = "UPDATE Customers SET isActive = 0 WHERE CusID = $id AND isActive = 1";
		$result = mysqli_query($con, $query);
		if ($result) {
			createLog('softDelete', $id, 'isActive', '');
			return array("status" => '1');
		} else {
			return Array("status" => "0", "message" => "Internal error occured!");
		}
		mysqli_close($con);
	} else {
		return Array("status" => "0", "message" => "Only managers with elevated permissions can soft delete customers");
	}
}

function purgeCusByID($id) {
	return Array("status" => "0", "message" => "Hahahaha! Nice try! Only Alec can do that");
}

function lockCusByID($id) {
	if (is_numeric($id) && $_SESSION['AuthLevel'] >= 1) {
		// Start Connection
		require("assets/php/database.php");
		$query = "UPDATE Customers SET isLocked = 1 WHERE CusID = $id AND isLocked = 0";
		$result = mysqli_query($con, $query);
		if ($result) {
			createLog('Lock', $id, 'isLocked', '');
			return array("status" => '1');
		} else {
			return Array("status" => "0", "message" => "Internal error occured!");
		}
		mysqli_close($con);
	} else {
		return Array("status" => "0", "message" => "Only managers with elevated permissions can lock customer accounts");
	}
}

function getAllLogsByCusID($id) {
	if (is_numeric($id)) {
		// Start Connection
		require("assets/php/database.php");
		$query = "SELECT * FROM Logs WHERE CusID = $id";
		$result = mysqli_query($con, $query);
		while ($row = mysqli_fetch_assoc($result))
		{
			$res[] = $row;
		}
		return $res;
		mysqli_close($con);
	} else { return false; }
}

function createLog($action, $cusid, $column, $data) {
	$user = $_SESSION['username'];
	$username = $_SESSION['name'];

	// Start Connection
	require("assets/php/database.php");
	$query = "INSERT INTO Logs (`Action`, `CusID`, `Column`, `Data`, `User`, `UserName`) VALUES ('$action', '$cusid', '$column', '$data', '$user', '$username')";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

function getAllLogs() {
	// Start Connection
	require("assets/php/database.php");
	$query = "SELECT * FROM Logs LIMIT 30";
	$result = mysqli_query($con, $query);
	while ($row = mysqli_fetch_assoc($result))
	{
		$res[] = $row;
	}
	return $res;
	mysqli_close($con);
}

/*********************************************************************/
/*								     */
/*		  	   USER ACCOUNTS		             */
/*								     */
/*********************************************************************/
function checkAccountAuth($id) {
	require("assets/php/database.php");
	$query = "SELECT verified FROM user_Accounts WHERE id = $id";
	$result = mysqli_fetch_assoc(mysqli_query($con, $query));
	return $result;
	mysqli_close($con);
}

function getPersonalNotes() {
	$user_id = $_SESSION['id'];
	require("assets/php/database.php");
	$query = "SELECT memo FROM user_Accounts WHERE id = '$user_id'";
	return mysqli_fetch_assoc(mysqli_query($con, $query));
	mysqli_close($con);
}
?>
