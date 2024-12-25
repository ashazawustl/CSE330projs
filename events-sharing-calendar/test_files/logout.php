<?php
ini_set("session.cookie_httponly", 1);
session_start();
header('Content-Type: application/json');
session_destroy();
echo json_encode(array(
    "success" => true, 
    "message" => "Logout successful."
));

?>