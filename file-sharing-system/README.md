[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/dsRPaEFS)
# CSE330
Shaza Ali 508179 ashazawustl

Abby Endale 508412 atendale

# FILESHARING Login System
## _by Shaza Ali & Abby Endale_

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Welcome to our file sharing system, SwiftFile! To access this platform, you'll need to create a custom username and password before being able to start sharing your files.
AngularJS-powered HTML5 Markdown editor.

## As a logged-in user, you should:
- see a list of all fles you've uploaded (files.php)
- open files that you've previously uploaded (files.php => view.php)
- upload files (files.php => upload.php => files.php)
- delete files (files.php => delete.php => files.php)
- log in and out! (login.php => files.php => logout.php => login.php)


## _Admin Login Features (Creative Portion)_
ADMIN is registered as a valid user in users.txt! 

Upon logging in, a new session variable is triggered, which verifies that the present user is an ADMIN. After triggernig, the user is sent to the admin-login.php page which allows the admin to select which user's files they wish to see. This updates the logged-in user and allows the admin to freely mainpulate the files as though they were the user. 

This carries into the files.php program, which has an additional "logout" button for the admin to switch users without having to go through a full logout process. Instead, the "logout" redirects to the user-change.php program. user-change.php acts as a secondary logout program, keeping the session going while removing user and file session data, etc. which prevent stale data from causing bugs within the ADMIN user experience. 
For example, without user-change.php, if ADMIN changed ada's files then tried to manipulate the url to view a file as alice, the program would send the ADMIN to a blank screen. Such problems are neatly resolved, however, if the program "forgets" that the ADMIN ever logged in as anyone else.
This pseudo-logout works in addition to the main logout button available to all logged users in users.txt, which fully destroys the session and returns the user to the original login screen.

## Usage

Access the webpage via http://ec2-3-93-79-188.compute-1.amazonaws.com/~ateEC/SwiftFile/login.php 

Valid User Names:
alice
ada
marie
ADMIN

since the users are essentially a password, they are case sensitive

## File Types Allowed

| File Type  |
| ------ 
| .txt Files |
| .jpg files | 
| .png files | 
| .jpeg files|
| .csv files |
| .docx files| 
| .pdf files | 
| .mov files |
| .mp4 files |
| .mp3 files |
| .m4a files |
| .webp files|

basically anything, but ec2 DOES have upload size limits, so please test with small files  D:

## License
none

## Credits
- Upload files code: https://www.sitepoint.com/file-uploads-with-php/
- Fonts used from Google Fonts
- Todd Sproull's 330 Wiki/Piazza
