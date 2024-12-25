<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: logout.php");
    exit;
}

$user = $_SESSION['user'];

/*
    CODE CREDIT:
    Basis for Upload functionality uses multiple lines from
    https://www.sitepoint.com/file-uploads-with-php/
    All Comments made by Abby & Shaza
*/

define("UPLOAD_DIR", "/srv/mod2group/" . $user . "/");
// Sanity check for valid file entry
if (!empty($_FILES["file"])) {
    $thisFile = $_FILES["file"];
    if ($thisFile["error"] !== UPLOAD_ERR_OK) {
        header("Location: files.php");
        exit;
    }
    $name = preg_replace("/[^A-Z0-9._-]/i", "_", $thisFile["name"]);
    $i = 0;
    $parts = pathinfo($name);
    //duplicate renaming fucntion, add numbers to name incrementing until copy number reached
    while (file_exists(UPLOAD_DIR . $name)) {
        $i++;
        $name = $parts["filename"] . "-" . $i . "." . $parts["extension"];
    }
    //move file into server
    $success = move_uploaded_file(
        $thisFile["tmp_name"],
        UPLOAD_DIR . $name
    );
    //reload files page to view success/failure of operation
    if (!$success) {
        header("Location: files.php");
        exit;
    } 
    else {
        header("Location: files.php");
        exit;
    }
    chmod(UPLOAD_DIR . $name, 0644);
} 

else {
    header("Location: files.php");
    exit;
}
