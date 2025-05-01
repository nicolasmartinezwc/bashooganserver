const MapProvider = require('./MapProvider');
const CharacterProvider = require('./CharacterProvider');

class Game {
    constructor(players, consoleSocket) {
        this.players = players; // Must be a set.
        this.consoleSocket = consoleSocket;
        this.map = this.generateMap();
        this.gameInformation = this.createGameInformation();
        this.players.forEach(player => { player.emit('game-started', this.gameInformation); });
        this.registerListeners();
    }

    registerListeners() {
        this.players.forEach(player => {
            player.on('move-requested', (direction) => {
                this.handleMoveRequest(player, direction);
            });
        });
    }

    handleMoveRequest(player, direction) {
        // TODO: Add turns logic
        /*
        const currentPlayerId = this.gameInformation.currentPlayerTurn;

        if (playerSocket.id !== currentPlayerId) {
            return;
        }
        */
        this.players.forEach(p => {
            p.emit('move-conceded', {
                id: player.id,
                direction: direction
            });
        });
    }

    generateMap() {
        return new MapProvider().getRandomMap();
    }

    generateCharacter() {
        return new CharacterProvider().getRandomCharacter();
    }

    /* Scans through each Y and X tile until it finds an empty one.
        Use this matix as an example:
        [0][0][0][0][0][0][0][0][0][0]
        [1][0][0][1][1][1][0][0][1][1]
        [0][0][0][0][0][0][0][0][0][0]
        [1][1][1][0][1][1][1][1][0][1]
        [0][0][0][0][0][0][0][0][0][0]
    */
    getInitialPositions() {
        const availablePositions = [];

        for (let y = 0; y < this.map.tiles.length; y++) {
            for (let x = 0; x < this.map.tiles[y].length; x++) {
                if (this.map.tiles[y][x] === 1) {
                    availablePositions.push({ x, y });
                }
            }
        }

        for (let i = availablePositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
        }

        return availablePositions;
    }

    chooseRandomStartingPlayer(players) {
        return Array.from(this.players)[Math.floor(Math.random() * players.length)].id;
    }

    createPlayersData(playerArray) {
        const shuffledPositions = this.getInitialPositions();
        return playerArray.map((player, index) => {
            const position = shuffledPositions.pop();
            const characterType = this.generateCharacter();
            return {
                id: player.id,
                nickname: `Player${index + 1}`,
                position,
                health: 100,
                status: 'alive',
                characterType: characterType
            };
        });
    }

    createGameInformation() {
        const playerArray = Array.from(this.players);
        const players = this.createPlayersData(playerArray);
        return {
            map: this.map,
            currentTurn: 0,
            currentPlayerTurn: this.chooseRandomStartingPlayer(players),
            players: players
        };
    }

    sendNewGameStatus() {
        this.players.forEach(player => {
            player.emit('game-status-update', this.gameInformation);
        });
    }

    finishGame() {
        this.players.forEach(player => {
            player.emit('game-finished');
        });
    }
}

module.exports = Game;
