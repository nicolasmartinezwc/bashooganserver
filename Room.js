const Game = require('./Game');

class Room {
    constructor(player) {
        this.maximumAllowedPlayers = 2;
        this.players = new Set([player]);
        this.currentlyPlaying = false;
        player.emit('joined-room');
    }

    hasPlayer(player) {
        return this.players.has(player);
    }

    isFull() {
        return this.players.size >= this.maximumAllowedPlayers;
    }

    addPlayerAndStartGame(player) {
        this.players.add(player);
        this.startGame();
    }

    startGame() {
        this.currentlyPlaying = true;
        this.game = new Game(this.players, this.consoleSocket);
    }

    finishGame() {
        this.game.finishGame();
        this.players = null;
        this.game = null;
        this.currentlyPlaying = false;
    }
}

module.exports = Room;