const Room = require('./Room');

class RoomsManager {
    constructor() {
        this.rooms = new Set();
    }

    debugRoom(player) {
        const newRoom = new Room(player);
        this.rooms.add(newRoom);
        newRoom.consoleSocket = this.consoleSocket;
        newRoom.startGame();
    }

    findGameFor(player) {
        for (let room of this.rooms) {
            if (!room.isFull()) {
                room.addPlayerAndStartGame(player);
                return;
            }
        }

        const newRoom = new Room(player);
        this.rooms.add(newRoom);
        newRoom.consoleSocket = this.consoleSocket;
    }

    endGameFor(player) {
        for (let room of this.rooms) {
            if (room.hasPlayer(player)) {
                // TODO: Emit to the server to release this player from the game
                room.finishGame();
                this.rooms.delete(room);
            }
        }
    }
}

module.exports = RoomsManager;

