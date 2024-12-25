<?php
	//Allows ADMIN to switch users without logging out
	session_start();
	unset($_SESSION['user']);
	//Sanity check, prevents bugs due to bad session variables
	// Check out README to learn more
    if(isset($_SESSION['filename'])){
        unset($_SESSION['filename']);
    }
	header('location: admin-login.php');
	exit;
?> 
