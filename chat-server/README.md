[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/LRsBrD_9)
# CSE330
Shaza Ali - 508179 - ashazawustl
Abby Endale - 508412 - atendale

# Chatroom Server 
## _by Shaza Ali & Abby Endale_

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Welcome to our chatroom service, Whisper Chatrooms! 
To access this platform, just create a temporary username and hop into a room! Please note that no two users with the same name can be live at the same time. Get to chatting with friends!

## Once logged in, you can:
- Join any room (both public and private)
- Create a room with an arbitrary name
- Create private rooms with passwords

## Private Rooms:
- The password input is optional, if filled, the room created will be a private room with the password entered as its pass.
- If the password input is left empty, the room will be public.

## Kicking & Banning:
- Only the creator of a room can kick or ban members
- Kicking and banning operate through buttons generated on the active users list
- The buttons only work for the room owner. 
- To be kicked or banned, the ban-to-be user must be in the room (thus on the active user list)
- Both banned and kicked users are told that they have been banned or kicked
- Kicked users can return to the room but banned users cannot
- If a banned user tries to rejoin the room they were banned from, they will recieve an alert reminding them they are banned

## Whispers vs All (Private messaging feature):
- Who messages are sent to is dictated by the 1) room they are sent in 2) the radio buttons in the send
- If ALL is selected:
  - to-user input will be disabled
  - Message will be sent to ALL active users in the room
- If WHISPER is selected:
  - to-user input will be enabled
  - must enter a target
  - Only the whisper target and the sender will see the whispers
  - If user A sends a whisper to user B, it will appear on A's end as _Whisper to B: message_ and on B's end as _Whisper from B: message_

## _(Creative Portion)_!
## Socket Based Pop-up Displays:
- Login Screen: present until logged in. Then logCheck() function is called to double check if the socket has disconnected or not by checking for an active username
- Home Screen: The main page displayed when logged in and hidden when logged out or when a chat room is selected. Home screen's display is actively linked to the actions of a specific socket's login or room join status
- Chat Rooms: Each chat room screen is a newly formed pop-up displaying the room for each socket that calls it through chatCheck(). Chat room pop-ups have several points of action:
  - Display when a room is joined
  - Stop displaying when a room is left
  - Stop displaying when a user is kicked
  - Stop displaying when a user is banned, and do not reopen
  - Do not reopen once logged out


## License
none

## Credits
- Fonts used from Google Fonts
- Todd Sproull's 330 Wiki/Piazza
- Certain CSS credits (check code, intext citations)
