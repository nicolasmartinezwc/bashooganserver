class Map {
    constructor(mapWidth, mapHeight) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.tiles = this.buildMap();
    }

    // Each subclass should build its own map.
    buildMap() {
        throw new Error('buildMap() must be implemented by subclass');
    }

    isTileDestroyed(x, y) {
        return this.tiles[y] && this.tiles[y][x] === 0; // 0 means the tile is empty.
    }

    destroyTile(x, y) {
        if (this.tiles[y] && this.tiles[y][x] !== 0) {
            this.tiles[y][x] = 0; // 0 means the tile is empty.
        }
    }
}

module.exports = Map;