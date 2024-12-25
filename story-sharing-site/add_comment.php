<?php
session_start();
//Validity Check: properly passed info + correct token
if (isset($_POST['new-comment'])) {
    if ($_POST['token'] != $_SESSION['token'] or !(isset($_SESSION['login']))) {
        header("Location: display.php");
        exit;
    }
    require 'database.php';
    $content = $_POST['new-comment'];
    $user_id = $_SESSION['user_id'];
    $story = $_POST['posted_on'];

    //inserting new comment into database for future retireval
    $stmt = $mysqli->prepare("INSERT into comms (content, posted_on, posted_by) values (?,?,?)");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('sss', $content, $story, $user_id);
    $stmt->execute();
    $stmt->close();

    header("Location: display.php");
    exit;
}
?>