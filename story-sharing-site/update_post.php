<?php
session_start();
if (!isset($_SESSION['login'])) {
    header("Location: display.php");
    exit;
}

// Checking if actual user is editing
if (isset($_POST['edited'])) {
    if ($_POST['token'] != $_SESSION['token']) {
        header("Location: display.php");
        exit;
    }
    require 'database.php';
    $content = $_POST['content'];
    $title = $_POST['title'];
    $link = $_POST['link'];
    $id = $_POST['story_id'];

    //calls the update command to change post entry in database
    $stmt = $mysqli->prepare("UPDATE posts SET title=?, content=?, link=? WHERE story_id=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('ssss', $title, $content, $link, $id);
    $stmt->execute();
    $stmt->close();
    header("Location: display.php");
    exit;
}
?>