<?php
session_start();
//saftey check: prevent bypasses via URL tampering
if (!isset($_SESSION['login'])) {
    header("Location: logout.php");
}
?>
<!DOCTYPE html>
<html lang ="en">

<head>
    <title>User Files</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="file-share.css" />
</head>

<body>
    <header>
        <h1>Welcome to SwiftFile Filesystem Sharing!</h1>
        <br>
        <h2>Files:</h2>
    </header>

    <hr>
    <br>
    <div class="file-display">
        <!-- Listing out all files belonging to CURRENTLY LOGGED IN user -->
        <?php
        $user = $_SESSION['user'];
        $dirpath = "/srv/mod2group/" . $user . "/";
        $files = scandir($dirpath);
        $files = array_diff($files, array('.', '..'));
        foreach ($files as $file) {
            $filepath = $dirpath . $file;
            if (is_file($filepath)) {
                echo "<li> $file </li> <br>";
            }
        }
        ?>
    </div>
    <div id="input-wrapper">
        <div class="file-actions">
            <h4>Enter the name of the file to open it</h4>
            <br>
            <form action="<?php echo htmlentities($_SERVER['PHP_SELF']); ?>" method="POST">
                <p>
                    <label for="filename">File Name:</label>
                    <input type="text" name="filename" id="filename" />
                </p>
            </form>
        </div>
        <br>
        <!-- Users can upload or delete files from system -->
        <div class="file-actions">
            <h4>Upload a New File</h4>
            <form action="upload.php" method="POST" enctype="multipart/form-data">
                <input id="file" type="file" name="file" />
                <input id="upload-button" type="submit" value="Upload" />
            </form>
        </div>
        <br>
        <div class="file-actions">
            <h4>Delete a file</h4>
            <form action="delete.php" method="POST" enctype="multipart/form-data">
                <input id = "input-box" type="text" name="textdel" />
                <input id = "delete-button" type="submit" value="Delete" />
            </form>
        </div>

    </div>

    <footer>
        <div class="logout-but">
            <a href="logout.php">LOGOUT USER</a>
        </div>
        <!-- Sanity check to prevent bugs from bad session variables. learn more in README -->
        <?php if (isset($_SESSION['admin'])) { ?>
            <div class="logout-but">
                <a href="user-change.php">Back to User Selection</a>
            </div>
        <?php } ?>
    </footer>

</body>

</html>

<?php
// Sanity check for valid filename entered
if (isset($_POST['filename'])) {

    $filename = $_POST['filename'];
    if (!preg_match('/^[\w_\.\-]+$/', $filename)) {
        echo "Invalid filename";
        exit;
    } else {
        if (in_array($filename, $files)) {
            $_SESSION['filename'] = $filename;
            header("Location: view.php");
        } else {
            echo "File not found, try again";
            exit;
        }
    }
}
?>