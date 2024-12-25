<?php
session_start();
if (!isset($_SESSION['login'])) {
    header("Location: display.php");
    exit;
}
if (isset($_POST['id'])) {
    $og_title = $_POST['title'];
    $og_content = $_POST['content'];
    $og_link = NULL;
    if (isset($_POST['link'])) {
        $og_link = $_POST['link'];
    }
    $story_id = $_POST['id'];
} else {
    header("Location: display.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<header>
    <title>Edit Comment</title>
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
        <form action="update_post.php" method="POST">
            <label for="editor"><h2>Edit Comment:</h2></label>
            <?php
            printf(
                "<label for=\"title\">Edit Title:</label>
                <input type=\"text\" id=\"title\" name=\"title\" value=\"%s\" required>
                <br>
                <br>
                <label for=\"content\">Edit Content:</label>
                <input type=\"text\" id=\"content\" name=\"content\" value=\"%s\" required>
                <br>
                <br>
                <label for=\"link\">Edit Link:</label>
                <input type=\"url\" id=\"link\" name=\"link\" pattern=\"https://.*\" value=\"%s\">
                <br>
                <br>
                <input type=\"hidden\" name=\"token\" value=\"%s\">
                <input type=\"hidden\" name=\"story_id\" value=\"%s\">",
                htmlspecialchars($og_title),
                htmlspecialchars($og_content),
                htmlspecialchars($og_link),
                htmlspecialchars($_SESSION['token']),
                htmlspecialchars($story_id)
            );
            ?>
            <input type="submit" id="edited" name="edited" value="Done">
        </form>
    </div>

</body>

</html>