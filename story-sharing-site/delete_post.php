<?php
session_start();
//Sanity check: is there a logged in user
if (!isset($_SESSION['login'])) {
    header("Location: display.php");
    exit;
}

//Checks user validity + sends the command for deletion of specific post
if (isset($_POST['id'])) {
    if ($_POST['token'] != $_SESSION['token']) {
        header("Location: display.php");
        exit;
    }
    require 'database.php';
    $id = $_POST['id'];

    $stmt = $mysqli->prepare("DELETE FROM posts WHERE story_id = ?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('s', $id);
    $stmt->execute();
    $stmt->close();

    //Back to main page once completed
    header("Location: display.php");
    exit;
}
?>