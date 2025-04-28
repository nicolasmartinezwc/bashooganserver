const Waterloo = require('./Maps/Waterloo');

class MapProvider {
    static Maps = Object.freeze({
        WATERLOO: new Waterloo()
    });

    getRandomMap() {
        const values = Object.values(MapProvider.Maps); 
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex];
    }
}

module.exports = MapProvider;
