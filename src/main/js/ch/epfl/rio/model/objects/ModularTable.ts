function padLeftTruncate(str: string, max: number): string {
    str = str.padEnd(max);
    if (str.length > max) {
        str = str.substring(0, max - 1) + '.';
    }
    return str;
}

function padMiddleTruncate(str: string, max: number): string {
    str = str.padStart(str.length + Math.floor((max - str.length) / 2)).padEnd(max);
    if (str.length > max) {
        str = str.substring(0, max - 1) + '.';
    }
    return str;
}

export default class ModularTable {
    private table: string[] = [];

    private readonly headerX: string[];
    private readonly headerY: string[];
    private readonly content: string[];

    private subHeaderX: string[] = [];
    private subHeaderY: string[] = [];

    private widthHeaderX: number = 9;
    private widthHeaderY: number = 9;
    private widthSubHeaderY: number = 6;

    private verticalSeparator: string = '|';
    private horizontalSeparator: string = '-';
    private intersectionSeparator: string = '+';


    constructor(headerX: string[], headerY: string[], content: string[]) {
        console.assert(content.length === headerX.length * headerY.length, 'ASR – content size should be the size of the cartesian product of headerX and headerY')

        this.headerX = [...headerX];
        this.headerY = [...headerY];
        this.content = [...content];
    }

    public withSubHeaderX(subHeader: string[]): ModularTable {
        this.subHeaderX = [...subHeader];
        return this;
    }

    public withSubHeaderY(subHeader: string[]): ModularTable {
        this.subHeaderY = [...subHeader];
        return this;
    }

    public withWidthHeaderX(width: number): ModularTable {
        this.widthHeaderX = width;
        return this;
    }

    public withWidthHeaderY(width: number): ModularTable {
        this.widthHeaderY = width;
        return this;
    }

    public withWidthSubHeaderY(width: number): ModularTable {
        this.widthSubHeaderY = width;
        return this;
    }

    public withVerticalSeparator(separator: string): ModularTable {
        this.verticalSeparator = separator;
        return this;
    }

    public withHorizontalSeparator(separator: string): ModularTable {
        this.horizontalSeparator = separator;
        return this;
    }

    public withIntersectionSeparator(separator: string): ModularTable {
        this.intersectionSeparator = separator;
        return this;
    }

    private addNewLine() {
        this.table.push('\n');
    }

    private addSeparator() {
        let valueSubHeaderY: string = (this.subHeaderY.length !== 0)
            ? `${this.horizontalSeparator.repeat(1 + this.widthSubHeaderY + 1)}${this.intersectionSeparator}`
            : '';
        this.table.push(`${this.intersectionSeparator}${this.horizontalSeparator.repeat(1 + this.widthHeaderY + 1)}${this.intersectionSeparator}${valueSubHeaderY}${(this.horizontalSeparator.repeat(1 + this.widthHeaderX + 1) + this.intersectionSeparator).repeat(this.headerX.length)}\n`)
    }

    public build(): string {
        // building header
        this.table.push(`  ${' '.repeat(this.widthHeaderY)} `);
        if (this.subHeaderY.length !== 0) {
            this.table.push(' ');
            this.table.push(` ${padMiddleTruncate('', this.widthSubHeaderY)} ${this.verticalSeparator}`);
        } else {
            this.table.push(this.verticalSeparator);
        }
        for (const hX of this.headerX) {
            this.table.push(` ${padMiddleTruncate(hX, this.widthHeaderX)} ${this.verticalSeparator}`);
        }
        this.addNewLine();

        // building sub header X
        if (this.subHeaderX.length != 0) {
            this.table.push(`  ${' '.repeat(this.widthHeaderY)} `);
            if (this.subHeaderY.length !== 0) {
                this.table.push(' ');
                this.table.push(` ${padMiddleTruncate('', this.widthSubHeaderY)} ${this.verticalSeparator}`);
            } else {
                this.table.push(this.verticalSeparator);
            }
            for (const hX of this.subHeaderX) {
                this.table.push(` ${padMiddleTruncate(hX, this.widthHeaderX)} ${this.verticalSeparator}`);
            }
            this.addNewLine();
            this.addSeparator();
        } else {
            // adding separator if no sub header X
            this.addSeparator();
        }

        // building content
        let row: number = 0;
        for (const hY of this.headerY) {
            this.table.push(`${this.verticalSeparator} ${padLeftTruncate(hY, this.widthHeaderY)} ${this.verticalSeparator}`);

            if (this.subHeaderY.length !== 0) {
                let value: string = (row >= this.subHeaderY.length)
                    ? padMiddleTruncate('???', this.widthSubHeaderY)
                    : padMiddleTruncate(this.subHeaderY[row], this.widthSubHeaderY);

                this.table.push(` ${value} ${this.verticalSeparator}`);
            }

            for (const col of Array(this.headerX.length).keys()) { // for col in range(this.headerX.length)
                let idx: number = row * this.headerX.length + col;
                let value: string = (idx >= this.content.length)
                    ? padMiddleTruncate('???', this.widthHeaderX)
                    : padMiddleTruncate(this.content[idx], this.widthHeaderX);

                this.table.push(` ${value} ${this.verticalSeparator}`);
            }

            this.addNewLine();
            this.addSeparator();

            row += 1;
        }


        return '```\n' + this.table.join('') + '\n```';
    }
}
