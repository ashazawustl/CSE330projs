<?php
session_start();
?>

<!DOCTYPE html>

<html lang="en">

<head>
    <title>Display Page</title>
    <link rel="stylesheet" href="display.css">
</head>

<body>
    <div class="site-header">

        <header>
            <h1>Post-It!</h1>
            <?php if (isset($_SESSION['username'])) { ?>
                <div id="userdisplay"><?php printf(
                                            "<h1>%s</h1>",
                                            htmlspecialchars($_SESSION['username'])
                                        ) ?></div>
                <input type="button" id="logout" name='logout' value="Log Out"
                    onclick="window.location.href='logout.php';">

            <?php } else { ?>
                <input type="button" id="register" name='register' value="Register"
                    onclick="window.location.href='register.php';">
                <input type="button" id="login" name="login" value="Log In"
                    onclick="window.location.href='login.php';">
            <?php } ?>
            <br>
        </header>
        <br>
    </div>
    <div id="posts">
        <?php
        require "database.php";
        $all_posts = $mysqli->prepare("SELECT posts.story_id, posts.title, posts.content, posts.link, 
        posts.posted_by, posts.likes, users.name FROM posts INNER JOIN users ON posts.posted_by=users.id");
        if (!$all_posts) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

        $all_posts->execute();

        $all_posts->bind_result($story_id, $title, $content, $link, $user_id, $likes, $username);

        //Build-A-Post workshop: Creates all posts based on user
        while ($all_posts->fetch()) {
            //If the owner of a post is not the current user
            if ($user_id != $_SESSION['user_id']) {
                //Creates the main post
                if ($link != NULL) {
                    printf(
                        "<div class=\"post\">
                        <h1>%s</h1>
                        <h3 class=\"by-line\">by %s</h3>
                        <div class=\"content\">
                            <p> %s </p>
                            <a href=%s>%s</a>
                        </div>
                        <div class=\"comment-section\">",
                        htmlspecialchars($title),
                        htmlspecialchars($username),
                        htmlspecialchars($content),
                        htmlspecialchars($link),
                        htmlspecialchars($link),
                    );
                } else {
                    printf(
                        "<div class=\"post\">
                        <h1>%s</h1>
                        <h3 class=\"by-line\">by %s</h3>
                        <div class=\"content\">
                            <p> %s </p>
                        </div>
                        <div class=\"comment-section\">",
                        htmlspecialchars($title),
                        htmlspecialchars($username),
                        htmlspecialchars($content),
                    );
                }
                generateComments($story_id, $user_id);

                addComment($story_id);
                //Adds the button handling & like views
                printf(
                    "   </div>
                        <div class=\"vote\">
                            <form action=\"add_like.php\" method=\"POST\">
                                <input type=\"submit\" name=\"like\" value=\"↑\" onsubmit= 'add_like.php'>
                                <label for=\"like\">%s Likes</label>
                                <input type=\"hidden\" name=\"token\" value=\"%s\">
                                <input type=\"hidden\" name=\"user_id\" value=\"%s\">
                                <input type=\"hidden\" name=\"story_id\" value=\"%s\">
                            </form>
                         </div>
                    </div>
                    ",
                    htmlspecialchars($likes),
                    htmlspecialchars($_SESSION['token']),
                    htmlspecialchars($_SESSION['user_id']),
                    htmlspecialchars($story_id)
                );
            } // if the owner of the post is the current user
            else {
                //Creates the main post
                if ($link != NULL) {
                    printf(
                        "<div class=\"post\">
                        <h1>%s</h1>
                        <h3 class=\"by-line\">by %s</h3>
                        <div class=\"content\">
                            <p> %s </p>
                            <a href=%s>%s</a>
                        </div>
                        <div class=\"comment-section\">",
                        htmlspecialchars($title),
                        htmlspecialchars($username),
                        htmlspecialchars($content),
                        htmlspecialchars($link),
                        htmlspecialchars($link),
                    );
                } else {
                    printf(
                        "<div class=\"post\">
                        <h1>%s</h1>
                        <h3 class=\"by-line\">by %s</h3>
                        <div class=\"content\">
                            <p> %s </p>
                        </div>
                        <div class=\"comment-section\">",
                        htmlspecialchars($title),
                        htmlspecialchars($username),
                        htmlspecialchars($content),
                    );
                }

                generateComments($story_id, $user_id);

                addComment($story_id);

                //Adds the vote views + prevents voting for your own post
                printf(
                    "   </div>
                        <div class=\"vote\">
                            <form>
                                <input type=\"button\" id=\"like\" name=\"like\" value=\"↑\">
                                <label for=\"like\">%s</label>
                            </form>
                        </div>",
                    htmlspecialchars($likes)
                );

                //Allows for the editing of your own post
                printf(
                    "   <div class=\"post_editors\">
                            <form method = 'POST' action = 'edit_post.php'>
                                <input type=\"hidden\" name=\"token\" value=\"%s\">
                                <input type=\"hidden\" name=\"id\" value=\"%s\">
                                <input type=\"hidden\" name=\"title\" value=\"%s\">
                                <input type=\"hidden\" name=\"content\" value=\"%s\">
                                <input type=\"hidden\" name=\"link\" value=\"%s\">
                                <button type = 'submit' class=\"post-alter\">Edit Post</button>
                            </form>",
                    htmlspecialchars($_SESSION['token']),
                    htmlspecialchars($story_id),
                    htmlspecialchars($title),
                    htmlspecialchars($content),
                    htmlspecialchars($link)
                );
                //Allows for the deletion of your own post
                printf(
                    "       <form method = 'POST' action = 'delete_post.php'>
                                <input type=\"hidden\" name=\"token\" value=\"%s\">
                                <input type=\"hidden\" name=\"id\" value=\"%s\">
                                <button type = 'submit' class=\"post-alter\">Delete Post</button>
                            </form>
                        </div>
                    ",
                    htmlspecialchars($_SESSION['token']),
                    htmlspecialchars($story_id)
                );
            }
        }
        $all_posts->close();

        //Allowance for users to add a comment => all validity checks happen on add_comment.php
        function addComment($story)
        {
            printf(
                "<form action=\"add_comment.php\" method=\"POST\">
                <input type=\"text\" name=\"new-comment\" placeholder=\"Add A Comment\">
                <input type=\"hidden\" name=\"posted_on\" value=\"%s\">
                <input type=\"hidden\" name=\"token\" value=\"%s\">
                </form>",
                htmlspecialchars($story),
                htmlspecialchars($_SESSION['token'])
            );
        }

        //Creates comment section for a given post
        function generateComments($story, $user_id)
        {
            require "database.php";
            //calls all comments made on that specfic post
            $all_comments = $mysqli->prepare("SELECT comms.content, users.name, comms.id FROM comms INNER JOIN users ON comms.posted_by=users.id WHERE comms.posted_on=?;");
            if (!$all_comments) {
                printf("Query Prep Failed: %s\n", $mysqli->error);
                exit;
            }

            $all_comments->bind_param('s', $story);
            $all_comments->execute();
            $all_comments->bind_result($content, $username, $com_id);
            while ($all_comments->fetch()) {
                //Checks if the logged in user is the commenter => if so, allows editing and deletion of the comment
                if ($username == $_SESSION['username']) {
                    printf(
                        "<div class=\"comment\">
                        <h3 class=\"commenter\">%s</h3><p>%s</p>
                        <div class=\"comm_butts\">
                        ",
                        htmlspecialchars($username),
                        htmlspecialchars($content),
                    );
                    printf(
                        "<form method = 'POST' action = 'edit_comment.php'>
                            <input type=\"hidden\" name=\"token\" value=\"%s\">
                            <input type=\"hidden\" name=\"id\" value=\"%s\">
                            <input type=\"hidden\" name=\"original\" value=\"%s\">
                            <button type = 'submit' onsubmit= 'edit_comment.php'>Edit</button>
                        </form>",
                        htmlspecialchars($_SESSION['token']),
                        htmlspecialchars($com_id),
                        htmlspecialchars($content)
                    );
                    printf(
                        "<form method = 'POST' action = 'delete_comment.php'>
                            <input type=\"hidden\" name=\"token\" value=\"%s\">
                            <input type=\"hidden\" name=\"id\" value=\"%s\">
                            <button type = 'submit'>Delete</button>
                        </form>
                        </div>
                        </div>",
                        htmlspecialchars($_SESSION['token']),
                        htmlspecialchars($com_id)
                    );
                }
                //if not the commenter, then can only view the comment
                else {
                    printf(
                        "<div class=\"comment\">
                            <h3 class=\"commenter\">%s</h3><p>%s</p>
                        </div>",
                        htmlspecialchars($username),
                        htmlspecialchars($content),
                    );
                }
            }
        }

        ?>
    </div>
    <br>
    <div class="spacing"></div>
</body>

<footer>
    <!-- Adding/Creating a post button placed in footer for easy, noticable access -->
    <div class="add-post">
        <form>
            <input type="button" id="post" name="post" value="Create Post"
                onclick="window.location.href='create_post.php';">
        </form>
    </div>
</footer>

</html>