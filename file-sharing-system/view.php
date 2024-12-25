<?php
session_start();
//saftey check: prevent bypasses via URL tampering
if(!isset($_SESSION['login'])){
        header("Location: logout.php");
    }
if(!isset($_SESSION['filename'])){
	header("Location: files.php");
}
//proceed if user exists
    $user = $_SESSION['user'];
    $filename = $_SESSION['filename'];
    $full_path = sprintf("/srv/mod2group/%s/%s", $user, $filename);

    //Gets the MIME type (e.g., image/jpeg)
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($full_path);

    //Set the Content-Type header to the MIME type of the file, and display the file.
    header("Content-Type: ".$mime);
    header('content-disposition: inline; filename="'.$filename.'";');
    readfile($full_path);
?>
