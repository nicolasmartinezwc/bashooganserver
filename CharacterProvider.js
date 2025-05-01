class CharacterProvider {
    static Characters = Object.freeze({
        CHARACTERONE: "CharacterOne",
        CHARACTERTWO: "CharacterTwo"
    });

    getRandomCharacter() {
        const values = Object.values(CharacterProvider.Characters); 
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex];
    }
}

module.exports = CharacterProvider;