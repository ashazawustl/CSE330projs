<?php
require "database.php";
ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

//Sanity check: A User is logged in
if (isset($_SESSION['user_id'])) {
    $startDate = $json_obj['startDate'];
    $endDate = $json_obj['endDate'];
    $user_id = $_SESSION['user_id'];

    //Check if any events exist for the user
    $check_query = "SELECT COUNT(*) FROM events WHERE user_id ='" . $user_id . "'";
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
    if ($count == 0) {
        echo json_encode(array(
            'success' => false,
            'message' => "No events for this user."
        ));
        exit;
    }
    $check->close();


    //If at least one event exists, grab it and all of its info
    $query = "SELECT * FROM events WHERE user_id = ". $user_id." AND datetime >= '" . $startDate . "' AND datetime < '" . $endDate . "'";
    $daily = [];
    $stmt = $mysqli->prepare($query);
    if (!$stmt) {
        echo json_encode(array(
            'success' => false,
            'message' => "input did NOT succeed"
        ));
        exit;
    }

    $stmt->execute();
    $events = $stmt->get_result();

    //Loop through all events returned and add their info into an array then push that array onto the returned array
    while ($event = $events->fetch_assoc()) {
        $daily[] = [
            'event_id' => htmlentities($event['event_id']),
            'title' => htmlentities($event['title']),
            'location' => htmlentities($event['location']),
            'datetime' => htmlentities($event['datetime'])
        ];
    }

    echo json_encode(array(
        'success' => true,
        'message' => "input succeeded",
        'result' => $daily
    ));
} else {
    echo json_encode(array(
        'success' => false,
        'message' => "Must log in for events"
    ));
}

exit;
