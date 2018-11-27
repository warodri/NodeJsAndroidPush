/*
    SERVER SIDE
    --------------------------------
    NODEJS
        -> FS    (file System)
        -> https
        -> express
        -> socket.io
*/

// Define our certificate files
// private key file
// certificate file

var fs = require('fs');
var options = {
    key  : fs.readFileSync('/etc/letsencrypt/live/vaskit.com/privkey.pem'),
    cert : fs.readFileSync('/etc/letsencrypt/live/vaskit.com/fullchain.pem')
};

var http = require('https');
var express = require('express')
, app = express()
, server = http.createServer(options, app)
, io = require('socket.io').listen(server);
server.listen(8083);

io.sockets.on('connection', function(socket) {
    
    console.log('New user connected!');
    
    socket.on('addUserTo', function(usernameAndChannel) {
        let username = usernameAndChannel.split('|')[0];
        let channel = usernameAndChannel.split('|')[1];
        socket.join(channel);
        socket.username = username;
        socket.room = channel;
        console.log("User: " + username + " is connected to channel: " + channel);        
    });
    
    socket.on('sendChat', function(chatText) {
        console.log("New chat text was sent from client: " + chatText);
        socket.broadcast.to(socket.room).emit('updateChat', chatText);
    });

    
});