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
    
    $query = "SELECT * FROM perms JOIN events ON events.event_id JOIN users ON users.user_id = events.user_id WHERE perms.event_id = events.event_id AND perms.user_id = ".$user_id." AND datetime >= '" . $startDate . "' AND datetime < '" . $endDate . "'";

    $daily = [];
    $stmt = $mysqli->prepare($query);
            if (!$stmt) {
                echo json_encode(array('success' => false,
                    'message' => "input did NOT succeed"));
                exit;
            }
            $stmt->execute();
            $events = $stmt->get_result();

            //If at least one event exists, grab it and all of its info
            while($event = $events->fetch_assoc()){
                $daily[] =[
                    'event_id' => htmlentities($event['event_id']),
                    'title' => htmlentities($event['title']),
                    'location' => htmlentities($event['location']),
                    'datetime' => htmlentities($event['datetime']),
                    'owner_id' => htmlentities($event['username'])
                ];
            }
    
    echo json_encode(array(
        'success' => true,
        'message' => "input succeeded",
        'result' => $daily
    ));
}
else{
    echo json_encode(array(
        'success' => false,
        'message' => "Must log in for events"
    ));
}
exit;
?>