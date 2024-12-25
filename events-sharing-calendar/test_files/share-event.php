<?php
require "database.php";
ini_set("session.cookie_httponly", 1);
session_start();
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);


if (isset($_SESSION['user_id'])) {
    $share_id = $json_obj['share_id'];
    $share_user = $json_obj['share_user'];
    $user_id = $_SESSION['user_id']; //update for session

    $token = $json_obj['token'];

    if (!hash_equals($_SESSION['token'], $token)) {
        die(json_encode(["success" => false, "message" => "Request forgery detected."]));
    }

    if (!preg_match('/^[\w_]+$/', $share_user) || !preg_match('/^[\w_]+$/', $share_id)) {
        echo json_encode(array(
            "success"=> false,
            "message" => "invalid entries, try again."
        ));
        exit;
    }

    $check_query = "SELECT COUNT(*) FROM events WHERE user_id ='" . $user_id . "' AND event_id ='" . $share_id . "'";
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
            'message' => "Share Failed: IDs don't match or you don't own this event"
        ));
        exit;
    }
    $check->close();


    $perm_check_query = "SELECT COUNT(*) FROM perms WHERE user_id ='" . $user_id . "' AND event_id ='" . $share_id . "'";
    $check_perms =  $mysqli->prepare($perm_check_query);
    if (!$check_perms) {
        echo json_encode(array(
            'success' => false,
            'message' => "Share Failed: Query Failed"
        ));
        exit;
    }
    $check_perms->execute();
    $check_perms->bind_result($count);
    $check_perms->fetch();
    if ($count != 0) {
        echo json_encode(array(
            'success' => false,
            'message' => "Share Failed: Event already shared with this user"
        ));
        exit;
    }
    $check_perms->close();


    $perms = $mysqli->prepare("INSERT into perms (event_id, user_id) values (?,?)");
    if (!$perms) {
        echo json_encode(array(
            'success' => false,
            'message' => "Share Failed: Query Failed"
        ));
        exit;
    }

    $perms->bind_param('ss', $share_id, $share_user);
    $perms->execute();
    $perms->close();
    echo json_encode(array(
        'success' => true,
        'message' => "Share Successful!"
    ));
}
else{
    echo json_encode(array(
        'success' => false,
        'message' => "Must log in for events"
    ));
}

exit;
