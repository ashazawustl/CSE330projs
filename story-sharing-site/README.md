[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/IrLmbvzN)
# CSE330
Name: Shaza Ali Id: 508179 Username: ashazawustl

Name: Abby Endale Id: 508412 Username: atendale


# Post It: Story Sharing Site
## _by Abby Endale & Shaza Ali_

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Welcome to our story posting system, PostIt! You can view the display with stories and commnets without loging in, however, to make a post, comment, or like yourself, you need to log in or register. Once you register you get redirected to the login page where you enter the information that you just used to make an account whose information is stored in an sql table. Once you log in, you are redirected to the display page where you now have access to features like:

- Liking posts
- Commenting on posts
- Making your own posts
- Editing your posts
- Editing your comments
- Deleting your posts
- Deleting your comments

## _Liking Posts Features (Creative Portion)_
The ability to like posts is split into three parts (with two different functions and a thorough validity check): 

First, we verify the user status: this verification checks 
1) That the user clicking the button is logged in
2) That the session token matches the logged in user's token
3) And the user clicking the button neither owns the post nor has liked it before

If the above is true, then we begin logging the like into the database. First, the add_like function is called which takes the user id and story id and adds it to the database of story likes.
It then uses the passed story id and sends it over to the function incLikeCount. Like count takes in this id and uses it to locate the story in the database and increments the total count of likes each story has
This count is then utelized in the main display page to show the total likes next to the button.

Now, if the above isn't true, the button simply does nothing and allows the normal functionality of the display page to continue uninterrupted.

## Usage

Access the webpage via [http://ec2-3-93-79-188.compute-1.amazonaws.com/~ateEC/mod3/display.php]

Valid Existing User Names and Passwords:
NOTE: the password for ALL "test" users is "pass" (other users exist in the system)

Valid Test Users:
- ada
- alice
- wario

## License
none

## Credits
- Todd Sproull's CSE330 Wiki
- (Abandoned, only present in shaza's testing branch) likes feature pipeline from Codecourse: https://www.youtube.com/watch?v=PQMtLDxOQRk 


