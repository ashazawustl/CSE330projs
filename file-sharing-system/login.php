<?php
session_start();
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

<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="login-style.css" />
	<title>Login</title>
</head>

<body>
	<div class = "login-section fadeInUp-animation">
		<h2>SwiftFile Filesystem Sharing</h2>
		<br>
	<form action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="POST">
		<p>
			<label for="user">Username:</label>
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
		echo "invalid username, try again.";
		exit;
	}
	// redirection for Admin login
	if (in_array($user, $allUsers)) {
		if($user == "ADMIN"){
           		$_SESSION['admin'] = True;
			$_SESSSION['login'] = True;
			$_SESSION['user'] = $user;
			header("Location: admin-login.php");
			exit;
		}
		// otherwise, if non-admin but vaild, sent to respective user's files page
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
