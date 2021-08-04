



var fs = require('fs');
var http = require('http');
var https = require('https');
const io = require('socket.io')(http);
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('csr.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

// your express configuration here

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
	console.log(socket.username + ': ' + message)
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, function() {
    console.log('listening on *:443');
});



