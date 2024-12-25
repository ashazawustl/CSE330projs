<?php
session_start();
//saftey check: prevent bypasses via URL tampering
if (!isset($_SESSION['user'])) {
    header("Location: logout.php");
    exit;
}

$user = $_SESSION['user'];

define("PATH", "/srv/mod2group/" . $user . "/");

//Sanity check to ensure file has been entered, 
//remove file from server then reload page
if (isset($_POST["textdel"])){
    $filetoDelete = $_POST["textdel"];

    $path = PATH . $filetoDelete;
    $success = unlink($path);

    if(!$success){
        echo "<p>Unable to delete file.</p>";
        header("Location: files.php");
        exit;
    } else{
        echo "<p>File deleted successfully!</p>";
        header("Location: files.php");
        exit;
    }
}
?>