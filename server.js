const express = require('express');
const app = express();
const server = require('http').createServer(app);
const open = require('open').default;
const io = require('socket.io')(server, {
    cors: {
        origin: "*", // O ["http://192.168.0.11", "http://localhost"]
        methods: ["GET", "POST"]
    }
});
const path = require('path');
const RoomsManager = require('./RoomsManager');
const allowedConsoleIPs = ['::1', '127.0.0.1', '192.168.0.11']; // IPv6 & IPv4 localhost
const roomsManager = new RoomsManager();
let consoleSocket = null;
app.use('/admin', express.static(path.join(__dirname, 'public')));


io.of('/admin').on('connection', (socket) => {
    const clientIp = socket.handshake.address;

    if (!allowedConsoleIPs.includes(clientIp)) {
        socket.disconnect(true);
        return;
    }

    if (consoleSocket && consoleSocket.connected) {
        consoleSocket.disconnect(true);
    }

    consoleSocket = socket;
    roomsManager.consoleSocket = socket;
    consoleSocket.emit('log', '✅ Console started successfully with id: ' + consoleSocket.id + '.');

    socket.on('disconnect', () => {
        if (socket === consoleSocket) {
            consoleSocket = null;
        }
    });
});

io.of('/game').on('connection', (socket) => {
    // Disconnect any incomming socket if the console is not ready.
    if (!consoleSocket || !consoleSocket.connected) {
        socket.disconnect(true);
        return;
    }

    consoleSocket.emit('log', 'New user connected, searching room for: ' + socket.id);

    roomsManager.findGameFor(socket);

    socket.on('error', (error) => {
        console.log('Error:', error);
    });

    socket.on('disconnect', () => {
        if (socket === consoleSocket) {
            consoleSocket = null;
        } else {
            roomsManager.endGameFor(socket);
        }
    });
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000/...');
    open('http://localhost:3000/admin');
});
