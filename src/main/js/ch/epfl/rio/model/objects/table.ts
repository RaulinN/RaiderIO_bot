const aff = require('../../../../../../res/affix.json');
const dun = require('../../../../../../res/dungeon.json');

const padMiddle = (str: string, max: number): string => {
    return str
        .padStart(str.length + Math.floor((max - str.length) / 2))
        .padEnd(max)
};

export default class Table {
    private readonly results: object;
    private readonly players: string[];

    private readonly dungeonNameWidth: number = 7;
    private readonly playerNameWidth: number = 9;

    private table: string[] = [];

    constructor(results: object, players: string[]) {
        this.results = results;
        this.players = players;
    }

    private addHeader(dungeonNameWidth: number = this.dungeonNameWidth, playerNameWidth: number = this.playerNameWidth) {
        this.table.push(`  ${''.padEnd(dungeonNameWidth)} |`);
        for (const player of this.players) {
            let padded = padMiddle(player, playerNameWidth);
            if (padded.length > playerNameWidth) {
                padded = padded.substring(0, playerNameWidth - 1) + '.'
            }
            this.table.push(` ${padded} |`);
        }
    }

    private addContent(affixes: string[], dungeonNameWidth: number = this.dungeonNameWidth, playerNameWidth: number = this.playerNameWidth) {
        const padColWidth = (affixes.length == 1) ? playerNameWidth : 3;

        for (const key in dun) {
            if (dun.hasOwnProperty(key)) {
                this.table.push(`| ${key.padEnd(dungeonNameWidth)} |`);

                for (const player of this.players) {
                    for (const affix of affixes) {
                        let levelInfo = this.results[player][affix][dun[key]];
                        if (levelInfo === undefined) {
                            this.table.push(` ${padMiddle('---', padColWidth)} |`)
                        } else {
                            let sym = (levelInfo['upgrades'] >= 1) ? '+' : ' ';
                            let value = `${sym}${('00' + levelInfo['level']).slice(-2)}`;
                            this.table.push(` ${padMiddle(value, padColWidth)} |`)
                        }
                    }
                }
                this.addNewLine();

                if (affixes.length == 1) {
                    this.addWideSeparator();
                } else {
                    this.addSeparator();
                }
            }
        }
    }

    private addSeparator(headerWidthY: number = this.dungeonNameWidth) {
        this.table.push(`+-${'-'.repeat(headerWidthY)}-+${'-----+'.repeat(this.players.length * 2)}\n`);
    }

    private addWideSeparator(headerWidthY: number = this.dungeonNameWidth) {
        this.table.push(`+-${'-'.repeat(headerWidthY)}-+${'-----------+'.repeat(this.players.length)}\n`);
    }

    private addNewLine() {
        this.table.push('\n');
    }

    private endTable(): string {
        return this.table.join('')
    }

    public buildSingle(affix: string, dungeonNameWidth: number = this.dungeonNameWidth, playerNameWidth: number = this.playerNameWidth): string {
        // table header
        this.addHeader();
        this.addNewLine();
        this.addWideSeparator();

        // table content
        this.addContent([affix]);

        return this.endTable();
    }

    public buildAll(dungeonNameWidth: number = this.dungeonNameWidth, playerNameWidth: number = this.playerNameWidth): string {
        // table header
        this.addHeader();
        this.addNewLine();

        // table sub-header
        this.table.push(`  ${''.padEnd(dungeonNameWidth)} |`);
        for (const player of this.players) {
            this.table.push(`  F  |  T  |`);
        }

        this.addNewLine();
        this.addSeparator();

        // table content
        this.addContent([aff.FORTIFIED, aff.TYRANNICAL]);

        return this.endTable();
    }
}
