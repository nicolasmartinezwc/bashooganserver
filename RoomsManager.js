const Room = require('./Room');

class RoomsManager {
    constructor() {
        this.rooms = new Set();
    }

    findGame(player) {

        for (let room of this.rooms) {
            if (!room.isFull()) {
                room.addPlayerAndStartGame(player);
                return;
            }
        }

        const newRoom = new Room(player);
        this.rooms.add(newRoom);
    }

    endGameFor(player) {
        for (let room of this.rooms) {
            if (room.hasPlayer(player)) {
                room.finishGame();
            }
        }
    }
}

module.exports = RoomsManager;

