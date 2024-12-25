<?php
ini_set("session.cookie_httponly", 1);
session_start();
include "database.php";

//Sanity check: A User is logged in
if (isset($_SESSION['user_id'])) {
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    if ($mysqli->connect_error) {
        echo json_encode(array(
            "success" => false,
            "message" => "Connections failed: " . $mysqli->connect_error
        ));
        exit;
    }

    $event_id = $json_obj['edit-id'];

    $old_title;
    $old_location;
    $old_datetime;


    //double check an event id was indeed inputted
    if ($event_id == null) {
        echo json_encode(["error" => "no event id entered"]);
        exit;
    }

    $token = $json_obj['token'];

    if (!hash_equals($_SESSION['token'], $token)) {
        die(json_encode(["success" => false, "message" => "Request forgery detected."]));
    }


    $stmt = $mysqli->prepare("SELECT title, location, datetime, user_id FROM events WHERE events.event_id=?");
    $stmt->bind_param("i", $event_id);
    $stmt->execute();
    $stmt->bind_result($old_title, $old_location, $old_datetime, $user_id);
    $stmt->fetch();
    $stmt->close();

    if ($_SESSION['user_id'] != $user_id) {
        echo json_encode(array(
            'success' => false,
            'message' => "You do not own this event."));
        exit;
    }

    //Item value checks
    $new_title = !empty($json_obj['new-title']) ? $json_obj['new-title'] : $old_title;
    $new_location = !empty($json_obj['new-location']) ? $json_obj['new-location'] : $old_location;
    $new_datetime = !empty($json_obj['new-datetime']) ? $json_obj['new-datetime'] : $old_datetime;

    $setClause = [];
    $params = [];

    if ($new_title !== $old_title) {
        $setClause[] = "title = ?";
        $params[] = $new_title; // Store the new value for binding
    }

    if ($new_location !== $old_location) {
        $setClause[] = "location = ?";
        $params[] = $new_location; // Store the new value for binding
    }

    if ($new_datetime !== $old_datetime) {
        $setClause[] = "datetime = ?";
        $params[] = $new_datetime; // Store the new value for binding
    }

    // Build the query
    $query = "UPDATE events SET " . implode(", ", $setClause) . " WHERE event_id = ? ";
    $params[] = $event_id; // Add event_id for the WHERE clause

    $stmt = $mysqli->prepare($query);

    if ($stmt) {
        // Determine types for binding (assuming title, location, datetime are strings and event_id is an integer)
        $types = str_repeat("s", count($params) - 1) . "i";
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            echo json_encode(array(
                "success" => true,
                "message" => "event updated successfully!"
            ));
        } else {
            echo json_encode(array(
                "success" => false,
                "message" => "error updating event, try again"
            ));
        }
        $stmt->close();
    } else {
        echo json_encode(array(
            "success" => false,
            "message" => "Error preparing the statement."
        ));
    }
    $mysqli->close();
} else {
    echo json_encode(array(
        'success' => false,
        'message' => "Must log in for events."
    ));
}
exit;
