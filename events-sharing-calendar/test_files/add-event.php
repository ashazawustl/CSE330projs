<?php
require "database.php";
ini_set("session.cookie_httponly", 1);
session_start();

//Sanity Check for login
if (isset($_SESSION['user_id'])) {
    header("Content-Type: application/json");
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $token = $json_obj['token'];
    //token check
    if (!hash_equals($_SESSION['token'], $token)) {
        die(json_encode(["success" => false, "message" => "Request forgery detected."]));
    }

    $title = $json_obj['title'];
    $location = $json_obj['location'];
    $datetime = date("Y-m-d H:i:s", strtotime($json_obj['datetime']));
    $user_id = $_SESSION['user_id']; //update for login

    //Filtering input
    if (!preg_match('/^[\w_]+$/', $title) || !preg_match('/^[\w_]+$/', $location) || !preg_match('/^[\w_]+$/', $datetime)) {
        echo json_encode(array(
            "success"=> false,
            "message" => "invalid entries, try again."
        ));
        exit;
    }

    //adding new event info to database
    $stmt = $mysqli->prepare("INSERT into events (title, datetime, location, user_id) values (?,?,?,?)");
    if (!$stmt) {
        echo json_encode(array('success' => "input did NOT succeed"));
        exit;
    }
    $stmt->bind_param('ssss', $title, $datetime, $location, $user_id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(array('success' => true,
    'message' => "event added"));
}else {
    echo json_encode(array(
        'success' => false,
        'message' => "Must log in for events"
    ));
}

exit;
