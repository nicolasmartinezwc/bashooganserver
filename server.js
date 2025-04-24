const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const RoomsManager = require('./RoomsManager');


app.use(express.static(path.join(__dirname, 'public')));

const allowedConsoleIPs = ['::1', '127.0.0.1']; // IPv6 & IPv4 localhost
const roomsManager = new RoomsManager();
let consoleSocket = null;

io.on('connection', (socket) => {
    const clientIp = socket.handshake.address;

    if (!consoleSocket) {
        if (allowedConsoleIPs.includes(clientIp)) {
            consoleSocket = socket;
            consoleSocket.emit('log', '✅ Console started successfully.');
        } else {
            console.log('❌ The first connection should always be the web client, otherwise the socket gets disconnected.');
            socket.disconnect(true);
            return
        }
    }

    // There should always be a consoleSocket instance.
    consoleSocket.emit('log', 'New user connected: ' + socket.id);

    roomsManager.findGameFor(socket);

    // Disconnect
    socket.on('disconnect', () => {
        if (socket === consoleSocket) {
            consoleSocket = null;
        } else {
            roomsManager.endGameFor(socket);
        }
    });
});

// Start listening on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});