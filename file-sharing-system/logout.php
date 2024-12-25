<?php
	// complete logout, will logout ADMIN too
	session_start();
	session_destroy();
	header('location: login.php');
	exit;
?> 


