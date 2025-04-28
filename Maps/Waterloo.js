const Map = require('./Map');

class Waterloo extends Map {
    constructor() {
        super(10, 10);
        this.landPieces = 3;
    }

     buildMap() {
        const result = [];

        for (let y = 0; y < this.mapHeight; y++) {
            let row = [];
            for (let x = 0; x < this.mapWidth; x++) {

                const twentyPercent = Math.floor(this.mapHeight * 0.2);
                const thirtyPercent = Math.floor(this.mapHeight * 0.3);
                const seventyPercentY = Math.floor(this.mapHeight * 0.7);

                const isWithinYRange = y >= twentyPercent && y <= thirtyPercent;
                const isAtSeventyPercentY = y === seventyPercentY;

                if (isWithinYRange || isAtSeventyPercentY) {
                    row.push(1);
                } else {
                    row.push(0);
                }
            }
            result.push(row);
        }

        return result;
    }
}

module.exports = Waterloo;


