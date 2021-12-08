import Table from '../../model/object/table';
import QueryManager from '../../model/network/manager';

const com = require('../../../res/command.json');
const aff = require('../../../res/affix.json');
const par = require('../../../res/parameter.json');

export function handleCommPing(): Promise<string> {
    return Promise.resolve('pong');
}

export function handleCommInfo(): Promise<string> {
    let info = require('../../../package.json');

    return Promise.resolve(JSON.stringify({
        'name': info.name,
        'version': info.version,
        'description': info.description,
        'repository': info.repository,
        'author': info.author,
        'license': info.license,
        'homepage': info.homepage,
    }, null, 2));
}

export function handleCommBest(arg: string[], queryManager: QueryManager): Promise<string> {
    // TODO modify any type
    // TODO return error strings
    let idx: number = `${com.__SEP__}${com.TABLE_EXEC}`.split(' ').length;
    let players: string[] = [];

    if (idx === arg.length) {
        return Promise.resolve(
            'Indique le mode dans la requête!\n' +
            'usage: `!table best <all|week|fortified|tyrannical> for player [players...]`\n' +
            'example: `!table best all for Myrxia Ederne`'
        );
    }

    let mode = arg[idx];
    idx += 1;


    if (idx == arg.length) {
        // error no 'for'
    }

    if (arg[idx] != 'for') {
        // error no 'for'
    }
    idx += 1;

    if (idx == arg.length) {
        // error no player(s)
    }

    while (idx != arg.length) {
        players.push(arg[idx]);
        idx += 1;
    }


    return queryManager.fetchPlayerInfos(players).then(r => {
        let results = queryManager.processPlayerInfos(r);
        let table = new Table(results, players);

        switch (mode.toLowerCase()) {
            case 'all':
                return ('```c\n' + table.buildAll() + '\n```\n');
            case 'week':
                // TODO week
                return '';
            case 'fortified':
                return ('```c\n' + table.buildSingle(aff.FORTIFIED) + '\n```\n');
            case 'tyrannical':
                return ('```c\n' + table.buildSingle(aff.TYRANNICAL) + '\n```\n');
            default:
                return '';
            // error unknown mode
        }
    });
}

export function handleCommExec(arg: string[], queryManager: QueryManager): Promise<string> {
    const isParameter = (str: string): boolean => {
        if (str.length !== par.AFFIXES.length || str[0] !== par.AFFIXES[0]) {
            return false;
        }

        for (let p in par) {
            if (par.hasOwnProperty(p) && str === par[p]) {
                return true;
            }
        }

        return false;
    };

    let affixes: string[] = [];
    let players: string[] = [];
    let idx: number = `${com.__SEP__}${com.TABLE_EXEC}`.split(' ').length;
    let currentParam: string[] = [];

    while (idx !== arg.length) {
        if (isParameter(arg[idx])) {
            switch (arg[idx]) {
                case par.AFFIXES:
                    currentParam = affixes;
                    break;
                case par.PLAYERS:
                    currentParam = players;
                    break;
                default:
                    console.log("ERR – wrong command");
                    break; // TODO
            }

        } else {
            // add parameter values to the corresponding list
            console.assert(currentParam !== undefined, `ASR – parameter values without parameter: idx = '${idx}', elem = '${arg[idx]}', arg = '${arg}'`);
            currentParam.push(arg[idx])
        }

        idx += 1;
    }

    return queryManager.fetchPlayerInfos(players).then(r => {
        return ('not supported yet');
        /*
        let results = processInfos(r);
        let table: Table = new Table(results, players);
        msg.reply('```c\n' + table.buildAll() + '\n```\n');
        */
    })
}
