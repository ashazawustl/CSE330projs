<!-- 
 Welcome to our Creative Portion!
 Add_like is the main facilitator for this portion and has three major parts
 Read more in the READMe
-->

<?php
session_start();
if (!isset($_SESSION['login'])) {
    header("Location: display.php");
    exit;
}
// Validation section
require 'database.php';
if (isset($_POST['token'])) {
    $story_id = $_POST['story_id'];
    $user_id = $_POST['user_id'];
    //Checking if user has liked this post before
    $stmt = $mysqli->prepare("SELECT COUNT(*) FROM post_likes WHERE story_id=? AND user_id=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('ss', $story_id, $user_id);
    $stmt->execute();

    $stmt->bind_result($count);
    $stmt->fetch();
    //If user has not liked the post before, add the like to the database
    if ($count == 0) {
        addLike($story_id, $user_id);
    } else {
        header("Location: display.php");
        exit;
    }
}


//Adds a like entry into the post_likes => calls incLikeCount if successfully added
function addLike($story_id, $user_id)
{
    require 'database.php';
    $stmt = $mysqli->prepare("INSERT INTO post_likes (story_id, user_id) values (?,?)");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('ss', $story_id, $user_id);
    $stmt->execute();
    $stmt->close();
    incLikeCount($story_id);
}

//Called from AddLike, Increments the Total Likes for a Post for display
function incLikeCount($story_id)
{
    require 'database.php';
    $stmt = $mysqli->prepare("UPDATE posts SET likes=likes + 1 WHERE story_id=?");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('s', $story_id);
    $stmt->execute();
    $stmt->close();
    header("Location: display.php");
    exit;
}

?>