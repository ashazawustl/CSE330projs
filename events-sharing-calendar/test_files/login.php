<?php
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such: 
$username = $json_obj['username'];
$password = $json_obj['password'];

if(!isset($json_obj['username']) || !isset($json_obj['password'])){
	echo json_encode(array(
		"success"=> false,
		"message"=> "username + password required" . $mysqli->connect_error
	));
	exit;
}

if($mysqli->connect_error){
	echo json_encode(array(
		"success" => false,
		"message" => "Connections failed: " . $mysqli->connect_error
	));
	exit;
}

if (!preg_match('/^[\w_]+$/', $username) || !preg_match('/^[\w_]+$/', $password)) {
	echo json_encode(array(
		"success"=> false,
		"message" => "invalid login, try again."
	));
	exit;
}

$stmt = $mysqli->prepare("SELECT username, hashed_password FROM users WHERE username = ?");
if (!$stmt) {
    echo json_encode(array(
        "success" => false,
        "message" => "Database error: " . $mysqli->error
    ));
    exit;
}

$stmt = $mysqli->prepare("SELECT COUNT(*), username, user_id, hashed_password FROM users WHERE users.username=?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($cnt, $username, $user_id, $hashed_password);
$stmt->fetch();


// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
session_start();

if($cnt == 1 && password_verify($password, $hashed_password)){
	ini_set("session.cookie_httponly", 1);
	session_start();
	$_SESSION['user_id'] = $user_id;
	$_SESSION['username'] = $username;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 
	$token = $_SESSION['token'];

	echo json_encode(array(
		"success" => true,
		"token" => $token,
		"message" => "login success!"
	));
	exit;

	if (!hash_equals($_SESSION['token'], $token)) {
		die("Request forgery detected");
	}

}else{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}


$stmt->close();
$mysqli->close();

?>