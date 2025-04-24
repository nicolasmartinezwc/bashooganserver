class Room {
    constructor(player) {
        this.maximumAllowedPlayers = 2;
        this.players = new Set([player]);
        this.currentlyPlaying = false;
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
        // this.players.forEach(player => player.socket.emit('game-started'));
    }

    finishGame() {
        this.currentlyPlaying = false;
        // this.players.forEach(player => player.socket.emit('game-finished'));
    }
}

module.exports = Room;