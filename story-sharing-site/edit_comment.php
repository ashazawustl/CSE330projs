<?php
session_start();
if (!isset($_SESSION['login'])) {
    header("Location: display.php");
    exit;
}

if (isset($_POST['id'])) {
    $original = $_POST['original'];
    $com_id = $_POST['id'];
} else {
    header("Location: display.php");
    exit;
}
?>

<!DOCTYPE html>

<html lang="en">
<header>
    <title>Edit Comment</title>
    <link rel="stylesheet" href="create-post.css">
</header>

<body>
    <div class="site-header">
        <br>

        <head>
            <h1>Post-It!</h1>
            <br>
        </head>
        <br>
    </div>

    <br>

    <div class="editor-wrapper">
        <form action="update_comment.php" method="POST">
            <label for="editor">Edit Comment:</label>
            <?php
            printf(
                "<input type=\"text\" id=\"editor\" name=\"editor\" value=\"%s\" required>
                <input type=\"hidden\" name=\"token\" value=\"%s\">
                <input type=\"hidden\" name=\"id\" value=\"%s\">",
                htmlspecialchars($original),
                htmlspecialchars($_SESSION['token']),
                htmlspecialchars($com_id)
            ); ?>
            <input type="submit" id="edited" name="edited" value="Done">
        </form>
    </div>
</body>
</html>