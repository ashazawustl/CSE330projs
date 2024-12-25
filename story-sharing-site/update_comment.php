<?php
session_start();

//Checking if actual user is editing
if (isset($_POST['edited'])) {
    if ($_POST['token'] != $_SESSION['token']) {
        header("Location: display.php");
        exit;
    }
    require 'database.php';
    $content = $_POST['editor'];
    $id = $_POST['id'];

    //calls the update command to change comment entry in database
    $stmt = $mysqli->prepare("UPDATE comms SET content=? WHERE id=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('ss', $content, $id);
    $stmt->execute();
    $stmt->close();
    header("Location: display.php");
    exit;
}
?>