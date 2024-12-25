const http = require("http"),
  fs = require("fs");

const port = 3456;
const file = "chat_client.html";

const server = http.createServer(function (req, res) {
  fs.readFile(file, function (err, data) {
    if (err) return res.writeHead(500);
    res.writeHead(200);
    res.end(data);
  });
});
server.listen(port);

const socketio = require("socket.io")(http, {
  wsEngine: 'ws'
});

const sessionState = {
  rooms: {},
  users: {}, // Store users by their usernames
  bannedUsers: []
}

let currentUser;

const io = socketio.listen(server);
io.sockets.on("connection", function (socket) {

  socket.on("login", (username) => {
    if (username && !sessionState.users[username]) {
      sessionState.users[username] = { socketId: socket.id, rooms: [] }; // Store socket ID with user
      currentUser = username;
      socket.data.username = username;
      console.log(username + ` logged in.`);
      socket.emit("login", `Welcome, ` + username + `! You are successfully logged in.`);
    } else if (sessionState.users[username]) {
      socket.emit("login", "Username is already taken. Please choose a different one.");
    } else {
      socket.emit("login", "Invalid username.");
    }
  });

  socket.on("logout", (username) => {
    if (sessionState.users[username]) {
      delete sessionState.users[username];
      socket.emit("logout", `Logged Out successfully: ${username}`);
    } else {
      socket.emit("logout", "No logged in user to log out");
    }
  });

  //assigned room owner to creator of the room
  function assignOwner(roomName, creatorUsername) {
    const creatorUser = sessionState.users[creatorUsername];
    if (creatorUser && creatorUser.socketId) {
      const ownerSocketId = creatorUser.socketId;
      sessionState.rooms[roomName].owner = creatorUsername;
      io.to(ownerSocketId).emit("assignedOwner", { roomName, isOwner: true, creatorUsername });
    }
  }

  // Create a new room
  socket.on("create-room", ({ roomName, password }) => {
    if (!socket.data.username) {
      socket.emit("error", "You must be logged in to create a room.");
      return;
    }
    if (!roomName) {
      socket.emit("error", "Room name is required.");
      return;
    }
    if (sessionState.rooms[roomName]) {
      socket.emit("error", "Room name already exists. Please choose a different name.");
    } else {
      const creatorUsername = socket.data.username;
      sessionState.rooms[roomName] = { name: roomName, users: [], password: password || null, owner: creatorUsername };
      console.log(`Room created: ${roomName}`);
      assignOwner(roomName, creatorUsername);
      console.log(sessionState.rooms[roomName]);
      io.emit("room-list", Object.values(sessionState.rooms)); // Update the room list for all clients
    }
  });

  //join a room
  socket.on("join-room", (roomName, password) => {
    const room = sessionState.rooms[roomName];

    if (room) {
        if (!socket.data.username) {
            socket.emit("error", "You must be logged in to join a room.");
            return;
        }

        if (room.bannedUsers && room.bannedUsers.includes(socket.data.username)) {
          socket.emit("banned", { room: roomName }); 
          return; 
      }

        if (room.password && room.password !== password) {
            socket.emit("error", "Wrong password, please try again.");
            return;
        }

        if (!room.users.includes(socket.data.username)) {
            room.users.push(socket.data.username);
            socket.join(roomName);
            io.to(roomName).emit("user-joined", { username: socket.data.username });
            io.to(roomName).emit("update-userlist", room.users.map(username => ({
                username,
                isOwner: username === room.owner
            })));
        } else {
            socket.emit("error", "You are already in this room.");
        }
    } else {
        socket.emit("error", "Room not found.");
    }
});


  //leave a room
  socket.on("leave-room", (roomName, username) => {
    const room = sessionState.rooms[roomName];
    if (room && room.users.includes(username)) {
      room.users = room.users.filter(user => user !== username);  // remove the user from the room
      socket.leave(roomName);  // leave the room on the server
      io.to(roomName).emit("user-left", { username });
      io.to(roomName).emit("update-userlist", sessionState.rooms[roomName].users);
    }

  });


  //send a whisper
  socket.on("send-direct", function (data) {
    const { roomName, message, username, whisperUser } = data;
    const room = sessionState.rooms[roomName];

    if (room) {
      if (room.users.includes(whisperUser)) {
        // Send the whisper to the target user only
        io.to(whisperUser).emit("whisper-message", {
          message: `Whisper from ${username}: ${message}`,
          roomName: roomName
        });
      } else {
        socket.emit("error", `User ${whisperUser} is not in the room.`);
      }
    }
  });

  //kick user
  socket.on("kick-user", ({ room, username }) => {
    const roomDetails = sessionState.rooms[room]; //get the room we're in
    const currentUser = socket.data.username; //get the current user

    if (roomDetails && roomDetails.owner === currentUser) { //check if our room matched the room the owner is in and if the owner is the current user
      const kickedUserSocket = io.sockets.sockets.get(sessionState.users[username].socketId); //assign a user socket variable to track the sockets of each user 
      if (kickedUserSocket) { //if the socket id is of the user being requested to kick then they'll be removed from the user list for that room
        kickedUserSocket.leave(room);
        roomDetails.users = roomDetails.users.filter(user => user !== username);

        kickedUserSocket.emit("kicked", { room }); //kicked socket.on will handle this in client
        io.to(room).emit("update-userlist", roomDetails.users.map(username => ({ //we're mapping the username and owner (matching owner details/retaining them from before) to update the room list
          username,
          isOwner: username === roomDetails.owner
        })));

        console.log(`${username} has been kicked from the room: ${room}`);
      }
    } else {
      socket.emit("error", "Only the room owner can kick users.");
    }
  });

  //ban user
  socket.on("ban-user", ({ room, username }) => {
    const roomDetails = sessionState.rooms[room];
    const currentUser = socket.data.username;

    if (roomDetails && roomDetails.owner === currentUser) {
        const bannedUserSocket = io.sockets.sockets.get(sessionState.users[username]?.socketId);

        if (bannedUserSocket) {
            roomDetails.bannedUsers = roomDetails.bannedUsers || []; 
            roomDetails.bannedUsers.push(username); //add the user to the banned list

            bannedUserSocket.leave(room);
            roomDetails.users = roomDetails.users.filter(user => user !== username);

            bannedUserSocket.emit("banned", { room });

            io.to(room).emit("update-userlist", roomDetails.users.map(username => ({
                username,
                isOwner: username === roomDetails.owner
            })));

            console.log(`${username} has been banned from the room: ${room}`);
        }
    } else {
        socket.emit("error", "Only the room owner can ban users.");
    }
});

  // Send message to room
  // Send a whisper message to a specific user
  socket.on("message_to_room", function (data) {
    const { roomName, message, username, whisperUser } = data;
    const room = sessionState.rooms[roomName];

    if (room) {
      if (whisperUser) {
        // get the socket ID of the whisper recipient by username
        const recipientSocketId = sessionState.users[whisperUser]?.socketId;

        if (recipientSocketId && room.users.includes(whisperUser)) {
          // Send the whisper message to both the recipient and the sender
          io.to(recipientSocketId).emit('whisper-message', {
            message: `Whisper from ${username}: ${message}`,
            roomName: roomName
          });
          socket.emit('whisper-message', {
            message: `Whisper to ${whisperUser}: ${message}`,
            roomName: roomName
          });
        } else {
          socket.emit('error', `User ${whisperUser} is not in the room.`);
        }
      } else {
        // For regular messages, send to all users in the room
        io.to(roomName).emit('chat-messages', {
          message: `${username}: ${message}`
        });
      }
    } else {
      socket.emit('error', 'Room not found.');
    }
  });

  // Fetch room list
  socket.on("fetch-room", () => {
    io.emit("room-list", Object.values(sessionState.rooms)); // update room list on all clients
  });


});