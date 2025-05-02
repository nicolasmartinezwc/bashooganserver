const MapProvider = require('./MapProvider');
const CharacterProvider = require('./CharacterProvider');

class Game {
    constructor(players, consoleSocket) {
        this.players = players; // Must be a set.
        this.consoleSocket = consoleSocket;
        this.map = this.generateMap();
        this.gameInformation = this.createGameInformation();
        this.registerListeners();
        this.players.forEach(player => { player.emit('game-started', this.gameInformation); });
        this.startTurn();
    }

    registerListeners() {
        this.players.forEach(player => {
            player.on('move-requested', (direction) => {
                this.handleMoveRequest(player, direction);
            });
        });

        this.players.forEach(player => {
            player.on('pass-turn', () => {
                this.handlePassTurn(player);
            });
        });
    }

    // Game building


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

    createTurns() {
        const turns = this.shuffleSocketIds(this.players); // Returns an array
        return {
            currentTurn: 0,
            currentPlayerTurn: turns[0],
            turns: turns,
            movementsDoneThisTurn: 0
        };
    }

    createGameInformation() {
        const playerArray = Array.from(this.players);
        const players = this.createPlayersData(playerArray);
        const turns = this.createTurns();
        return {
            map: this.map,
            players: players,
            turns: turns
        };
    }

    // Turns and actions

    startTurn() {
        const turns = this.gameInformation.turns;

        if (this.turnTimeout) {
            clearTimeout(this.turnTimeout);
        }

        // A new turn starts automatically after 10s
        this.turnTimeout = setTimeout(() => {
            this.startTurn();
        }, 10000);

        turns.currentTurn++;
        turns.movementsDoneThisTurn = 0;

        if (turns.currentTurn === 1) {
            return;
        }

        const currentIndex = turns.turns.indexOf(turns.currentPlayerTurn);
        const isLast = currentIndex === turns.turns.length - 1;
        turns.currentPlayerTurn = isLast ? turns.turns[0] : turns.turns[currentIndex + 1];

        this.players.forEach(player => { player.emit('start-turn', this.gameInformation); });
    }

    isCurrentTurnOf(player) {
        return this.gameInformation.turns.currentPlayerTurn == player.id;
    }

    handlePassTurn(player) {
        if (!this.isCurrentTurnOf(player)) {
            return;
        }
    
        this.startTurn();
    }

    handleMoveRequest(player, direction) {
        if (!this.isCurrentTurnOf(player)) {
            player.emit('move-denied');
            return;
        }

        if (this.gameInformation.turns.movementsDoneThisTurn > 6) {
            player.emit('move-denied');
            return;
        }

        this.gameInformation.turns.movementsDoneThisTurn++;
        this.players.forEach(p => {
            p.emit('move-conceded', {
                id: player.id,
                direction: direction
            });
        });
    }

    finishGame() {
        this.players.forEach(player => {
            player.emit('game-finished');
        });
    }

    // Utils
    shuffleSocketIds(socketSet) {
        const ids = Array.from(socketSet).map(socket => socket.id);
    
        for (let i = ids.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ids[i], ids[j]] = [ids[j], ids[i]];
        }
    
        return ids;
    }
}

module.exports = Game;
