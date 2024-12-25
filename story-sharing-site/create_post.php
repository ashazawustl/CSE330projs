<?php
session_start();
if (!isset($_SESSION['login'])) {
    header("Location: display.php");
    exit;
}
?>

<!DOCTYPE html>

<html lang="en">

<head>
    <title>sample stuff</title>
    <link rel="stylesheet" href="create-post.css">
</head>

<body>
    <div class="site-header">
        <br>

        <header>
            <h1>Post-It!</h1>
            <br>
        </header>
        <br>
    </div>

    <br>

    <div class="site-body">
        <div class="create-post">
            <form action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="POST">
                <div class="post-contents">
                    <h2>Title: </h2>
                    <input type="text" id="posttitle " name="posttitle" placeholder="Title" required>
                    <br>
                    <br>
                    <h2>Content: </h2>
                    <br>
                    <input type="text" id="body" name="body" placeholder="Content" required>
                    <br>
                    <br>
                    <h2>Link (optional): </h2>
                    <input type="url" name="link" id="link" placeholder="https://example.com" pattern="https://.*">
                    <br>
                    <input type="hidden" id="token" name="token" value="<?php echo htmlentities($_SESSION['token']); ?>">
                </div>
                <br>
                <br>
                <br>
                <div class="post">
                    <input type="submit" id="post" name="post" value="Post">
                </div>
            </form>
        </div>
    </div>


</body>
<?php
//Checking if actual user is posting
if (isset($_POST['post'])) {
    if (!(isset($_SESSION['token'])) or ($_POST['token'] != $_SESSION['token'])) {
        header("Location: display.php");
        exit;
    }
    require 'database.php';
    $title = $_POST['posttitle'];
    $content = $_POST['body'];
    $user_id = $_SESSION['user_id'];

    //Link check + sending to Database
    if (isset($_POST['link'])) {
        $link = $_POST['link'];
        $stmt = $mysqli->prepare("INSERT into posts (title, content, link, posted_by) values (?,?,?,?)");
        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        $stmt->bind_param('ssss', $title, $content, $link, $user_id);
        $stmt->execute();
        $stmt->close();
    } else {
        //if there is no link, do not insert one
        $stmt = $mysqli->prepare("insert into posts (title, content, posted_by) values (?,?,?)");
        if (!$stmt) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        $stmt->bind_param('sss', $title, $content, $user_id);
        $stmt->execute();
        $stmt->close();
    }
    header("Location: display.php");
    exit;
}
?>

</html>