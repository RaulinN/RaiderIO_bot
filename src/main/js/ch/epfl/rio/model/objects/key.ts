const dun = require('../../../../../../res/dungeon.json');

export default class MythicKey {
    private readonly dungeon: string;
    private readonly level: number;

    constructor(representation: string) {
        representation = representation.toUpperCase();

        let values = representation.split('+');

        // check if we have a key of the form "nw+21"
        if (values.length == 2) {}
        else if (values.length > 2) {
            // TODO error
        } else {
            // check if we have a key of the form "nw21"
            let dungeon = representation.match(/[a-zA-Z]+/g);
            if (dungeon === null || dungeon.length != 1) {

            }

            let level = representation.match(/\d+/g);
            if (level === null || level.length != 1) {

            }

            values = [dungeon![0], level![0]];
        }

        if (!(/^[a-zA-Z]+$/.test(values[0])) || isNaN(parseInt(values[1]))) {
            // TODO invalid
        }

        if (!(values[0] in dun)) {
            // TODO invalid unnown dungen
        }

        if (values[1].includes('.') || values[1].includes(',') || parseInt(values[1]) < 1) {
            // TODO invalid level
        }

        this.dungeon = values[0];
        this.level = parseInt(values[1]);
    }

    getLevel(): number {
        return this.level;
    }

    getShortName(): string {
        return this.dungeon;
    }

    getFullName(): string {
        return dun[this.dungeon];
    }

    toString(): string {
        return `${this.dungeon}+${this.level}`;
    }
}
