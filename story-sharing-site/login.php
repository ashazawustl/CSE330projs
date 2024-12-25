<?php
session_start();
require "database.php";
?>

<!DOCTYPE html>

<html lang="en">
<head>
    <title>Login Page</title>
    <link rel="stylesheet" href="login.css">
</head>

<body>

    <div class="main-login">
        <h1>Post It!</h1>
        <br>
        <div class="centerthese">
            <form action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="POST">
                <h3>Username: </h3> <input type="text" id="username" name="username">
                <br>
                <br>
                <h3>Password: </h3> <input type="password" id="pass" name="pass">
                <br>
                <br>
                <input type="submit" id="loginbut" name="loginbut" value="Log In">
                <br>
                <br>
            </form>
            <a href="register.php">
                <p>Don't Have an Account?</p>
            </a>
        </div>
    </div>

</body>
<?php
if (isset($_POST['loginbut'])) {
    $user = $_POST['username'];
    $pass_guess = $_POST['pass'];
    //Filtering Input
    if (!preg_match('/^[\w_\-]+$/', $user) and !preg_match('/^[\w_\-]+$/', $pass_guess)) {
        echo "invalid login, try again.";
        exit;
    }
    //Retrieving user data
    $stmt = $mysqli->prepare("SELECT COUNT(*), id, hashed_password FROM users WHERE users.name=?");
    $stmt->bind_param('s', $user);
    $stmt->execute();

    $stmt->bind_result($cnt, $user_id, $pass_hash);
    $stmt->fetch();

    //Checking DB login data => if a user is in the system, logs in + redirects to home page
    if ($cnt == 1 && password_verify($pass_guess, $pass_hash)) {
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $user;
        $_SESSION['login'] = True;
        $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
        header("Location: display.php");
        exit;
    } else {
        //login failed => try again
        header("Location: login.php");
        exit;
    }
}
?>


</html>