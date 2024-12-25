<?php

header("Content-Type: application/json"); 
require 'database.php';


$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);


if (!isset($json_obj['username']) || !isset($json_obj['password'])) {
    echo json_encode(array(
        "success" => false,
        "message" => "Username and password are required"
    ));
    exit;
}

$username = $json_obj['username'];
$password = $json_obj['password'];


	if (!preg_match('/^[\w_]+$/', $username)) {
        error_log("Invalid username format: " . $username);
        echo json_encode(array(
			"success"=>false,
			"message"=> "invalid registry, try again."
		));
		exit;
    }
    if (!preg_match('/^[\w_]+$/', $password)){
        error_log("password username format: " . $password);
        echo json_encode(array(
			"success"=>false,
			"message"=> "invalid registry, try again."
		));
		exit;
    }


$cnt = checkUser($username);


if($cnt == 0) {
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $mysqli->prepare("INSERT INTO users (username, hashed_password) values (? , ?)");
        if (!$stmt) {
			echo json_encode(array(
				"success"=>false,
				"message"=> " Query Prep Failed:" . $mysqli->error
			));
            exit;
        }

        $stmt->bind_param('ss',  $username, $hashed_password);
        $stmt->execute();
        $stmt->close();

    

    session_start();
    $_SESSION['username'] = $username;
    $_SESSION['login'] = true;
        
        echo json_encode(array(
            "success" => true,
            "message" => "Registration successful"
        ));
        exit; 

    } else {
        
        echo json_encode(array(
            "success" => false,
			"message"=> "Username taken, try again"
		)) ;
        exit;
    }

    function checkUser($username)
    {
        require 'database.php';

        $stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
        $stmt->bind_param('s', $username);
        $stmt->execute();
    
        $stmt->bind_result($cnt);
        $stmt->fetch();
        $stmt->close();
        return $cnt;
    }
    
?>