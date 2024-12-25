<?php
session_start();
?>
<!DOCTYPE html>

<html lang="en">

<head>
    <title>Login Page</title>
    <link rel="stylesheet" href="register.css">
</head>

<body>

    <div class="main-register">
        <h1>Post It!</h1>
        <br>
        <div class="centerthese">
            <form action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="POST">
                <label for="user">Username:</label>
                <input type="text" id="user" name="user" required>
                <br>
                <br>
                <label for="pass">Password:</label>
                <input type="password" id="pass" name="pass" required>
                <br>
                <input type="submit" id="loginbut" name="loginbut" value="Register">
                <br>
                <br>
            </form>
            <h2>Once registered, you will be redirected to the login page!</h2>
            <a href="login.php">
                <p>Already Have an Account?</p>
            </a>
        </div>
    </div>

</body>
<?php
require "database.php";
//Checking validity of request
if (isset($_POST['loginbut'])) {
    $user = $_POST['user'];
    $pass = $_POST['pass'];
    //Filtering Input
    if (!preg_match('/^[\w_\-]+$/', $user) and !preg_match('/^[\w_\-]+$/', $pass)) {
        echo "invalid registry, try again.";
        exit;
    }

    $cnt = checkUser($user);

    if ($cnt == 0) {
        // username not taken => hash and store password along with username
        $pass_hashed = password_hash($pass, PASSWORD_BCRYPT);
        echo $pass_hashed;
        $stmt2 = $mysqli->prepare("insert into users (name, hashed_password) values (?,?)");
        if (!$stmt2) {
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        $stmt2->bind_param('ss', $user, $pass_hashed);
        $stmt2->execute();
        $stmt2->close();
        header("Location: login.php");
        exit;
    } else {
        //registry failed
        echo "Username taken, try again";
        exit;
    }
}

//Checks if the username is taken
function checkUser($username)
{
    require "database.php";
    $stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE name=?");
    $stmt->bind_param('s', $username);
    $stmt->execute();

    $stmt->bind_result($cnt);
    $stmt->fetch();
    return $cnt;
}
?>

</html>