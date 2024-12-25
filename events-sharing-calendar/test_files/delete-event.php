<?php
require "database.php";
ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

//Sanity check: A User is logged in
if (isset($_SESSION['user_id'])) {
    $event_id = $json_obj['del_id'];
    $user_id = $_SESSION['user_id'];

    $token = $json_obj['token'];

    if (!hash_equals($_SESSION['token'], $token)) {
        die(json_encode(["success" => false, "message" => "Request forgery detected."]));
    }

    //Filtering input
    if (!preg_match('/^[\w_]+$/', $event_id)) {
        echo json_encode(array(
            "success"=> false,
            "message" => "invalid entries, try again."
        ));
        exit;
    }

    //Checking if this event 1) exists 2) is owned by the user
    $check_query = "SELECT COUNT(*) FROM events WHERE user_id =" . $user_id . " AND event_id= ". $event_id;
    $check =  $mysqli->prepare($check_query);
    if (!$check) {
        echo json_encode(array(
            'success' => false,
            'message' => "Share Failed: Query Failed"
        ));
        exit;
    }
    $check->execute();
    $check->bind_result($count);
    $check->fetch();
    //If check fails, return fail message
    if ($count == 0) {
        echo json_encode(array(
            'success' => false,
            'message' => "You don't own this event"
        ));
        exit;
    }
    $check->close();

    //If check passes, delete event from database
    $query = "DELETE FROM events WHERE event_id = " . $event_id;
    $stmt = $mysqli->prepare($query);
    if (!$stmt) {
        echo json_encode(array(
            'success' => false,
            'message' => "input did NOT succeed"
        ));
        exit;
    }

    $stmt->execute();
    $stmt->close();
    echo json_encode(array(
        'success' => true,
        'message' => "event deleted",
    ));
} else {
    echo json_encode(array(
        'success' => false,
        'message' => "Must log in for events."
    ));
}

exit;
