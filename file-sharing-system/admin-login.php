<?php
//saftey check: prevent bypasses via URL tampering
session_start();
if (!isset($_SESSION['admin'])) {
	header("Location: logout.php");
}
//Read in users.txt, ensure all current valid users are considered
$h = fopen("/srv/mod2group/users.txt", "r");
$allUsers = array();
while (!feof($h)) {
	$item = fgets($h);
	$item = rtrim($item, "\r\n");
	array_push($allUsers, $item);
}
fclose($h);
?>


<!DOCTYPE html>
<html lang ="en">

<!-- Admin login: allows ADMIN user to select users for whom to manipulate files -->
<head>
	<title>Admin Login</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"> 
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="admin-login.css" />
</head>

<body>
<div class = "admin-login-section fadeInUp-animation">
	<header>
		<h1>Admin Login</h1>
	</header>
	<br>
	<h2>Which User Would You Like to Login As?</h2>
	<br>
	<form action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="POST">
		<p>
			<label for="user">User's username:</label>
			<input type="text" name="user" id="user" />
		</p>
	</form>
</div>

</body>

</html>

<?php
// Sanity check for valid name entered
if (isset($_POST['user'])) {
	$user = $_POST['user'];
	if (!preg_match('/^[\w_\-]+$/', $user)) {
		echo "invalid entry, try again.";
		exit;
	}
	if (in_array($user, $allUsers)) {
		//if user is in the system, redirect to selected user's files
		echo "registered user!
		";
		$_SESSION['login'] = True;
		$_SESSION['user'] = $user;
		header("Location: files.php");
		exit;
	} else {
		echo "not a registered user, try again.";
		$user = NULL;
		exit;
	}
}
?>