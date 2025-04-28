const MapProvider = require('./MapProvider');

class Game {
    constructor(players, consoleSocket) {
        this.players = players; // Should be a set
        this.map = new MapProvider().getRandomMap();
        this.consoleSocket = consoleSocket;
        const gameInformation = {
            players: Array.from(this.players).map(player => ({ id: player.id })),
            map: this.map
        }
        this.players.forEach(player => { player.emit('game-information', gameInformation); });
    }
}

module.exports = Game;
