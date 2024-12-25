[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/LRsBrD_9)
# CSE330
Abby Endale - 508412 - atendale
Shaza Ali - 508179 - ashazawustl

# Events Sharing Calendar
## _by Shaza Ali & Abby Endale_

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Welcome to our social events calendar, CalPal! To access this platform, you'll need to create a custom username and password before being able to start creating your events and sharing them with friends!
AngularJS-powered HTML5 Markdown editor.

## As a not logged-in user, you should:
- be able to see a calendar with no events
- register as a user
- go through previous and next months on the calendar

## As a logged-in user, you should:
- be able to create events
- be able to share vents with another user
- be able to delete events
- be able to edit events
- see events you created and that other users have shared with you
- log in and out!

## _(Creative Portion)_!

## Pop-Ups
Each of the event customization buttons has a popUp, popDown, and pop_All_Down function called if requested via clicking via onClick events. popUp() displays the requested pop up form and makes any other pop up forms that were open get hidden again to reveal the newly requested pop up. popDown() hides the requested form again either when another pop up is requested or when the Cancel button is clicked. pop_All_Down() deactivates any/all displayed pop up forms on the page.

## Event Location
Users have the ability to enter the event location when creating an event and can also edit that lcoation via the Edit Event button. This is stored in the events table of the CalPal database under the column 'location'.

## Editing Events
In the clanedar.html, there's a series of pop up forms associated with different buttons with type "submit". A user will only be able to edit an event when logged into their account that is associated with a table of events linked to their user id. Once logged in, they can click on the 'Edit Event' button which asks them to enter the event id and then fill out whatever information they want to change about the event. It is not necessary for the user to edit every single detail about the event. They have the option to enter changes for only one or several fields. Should they only change some things, the other information will be retianed by accessing the old/already stored verison of the information for that field while the entered changes replace old information that's not wanted by the user anymore.

## Toggle Dark Mode
The toggle dark mode button is of type 'button' and works in tandem with the LDmode.js file and the calendar.css file. The page color scheme is defaulted to whatever is defined in the :root variables. When the button pressed, the root variables are grabbed by the JS file from the CSS file and compared to a variable 'bg' to determine whether or not the current background should be switched to the non-default colors or not. If the page is re-rendered upon logout, the page color schme goes back to its intiial default.

## Share/Unshare Event
The share event portion on the calendar.js files pulls the 'share-id', and 'share-user' values from a Share Event popUP() forms and checks the user token before allowing a user to share their event with another user. This works in tandem with the share-event.php file which calls a query to check the validity of the share request via checking the event ID and User ID in the events and perms tables. If either of these are invalid, the query and share doesn't go through. If the request is validated, then the event associated with the Event ID is shared with the requested User (associated with the user ID). Both the original creator fo the event and the user that the vent was shared with can then see it on their calendars.


## Usage

Access the webpage via http://ec2-3-93-79-188.compute-1.amazonaws.com/~ateEC/mod5/calendar.html 

USERS FOR SHARE TESTING:
Note: 
- all users listed have password "pass"
- usernames are case sensitive

marie (id: 2)
ada (id: 3)
alice (id: 4)


## License
none

## Credits
- Toggle Function: Jayce TA Hours
- Fonts used from Google Fonts
- Todd Sproull's 330 Wiki/Piazza