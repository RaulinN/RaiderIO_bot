import { IncomingMessage } from "http";

const https = require('https');

const aff = require('../../../res/affix.json');

class Cache {
    private els: Map<string, any>;

    constructor() {
        this.els = new Map()
    }
}

export default class QueryManager {
    private cache: Cache; // TODO implement cache

    constructor() {
        this.cache = new Cache()
    }

    private fetchRemotePlayerInfos(player: string, field: string, modifier: string = '', realm: string = 'Dalaran', region: string = 'eu'): Promise<object> {
        let options = {
            hostname: 'raider.io',
            port: 443,
            path: `/api/v1/characters/profile?region=${region}&realm=${realm}&name=${player}&fields=${field}${modifier}`,
            method: 'GET'
        };

        return new Promise((resolve, reject) => {
            let request = https.request(options, (result: IncomingMessage) => {
                console.log(`DBG – received a GET answer with status code '${result.statusCode}' for '${player}-${realm}(${region})' on '${field}${modifier}'`);

                let chunks = '';
                result.on('data', (chunk: string) => chunks += chunk);

                result.on('end', () => {
                    try {
                        resolve(JSON.parse(chunks));
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            request.on('error', (e: Error) => reject(e));
            request.end();
        })
    };

    public fetchPlayerInfos(players: string[]) {
        let promises: Promise<object>[] = [];

        for (const player of players) {
            for (const field of ['mythic_plus_best_runs', 'mythic_plus_alternate_runs']) {
                promises.push(this.fetchRemotePlayerInfos(player, field, ':all'));
            }
        }

        return Promise.all(promises);

        // TODO ignoring realm / region
    }

    // TODO modify any type
    public processPlayerInfos(infos: any): object {
        const runContainsAffixes = (run: object, affixes: string[]): boolean => {
            /**
             * Returns whether a run contains a set of affixes or not
             *
             * @param {Object} run - object containing the details of the m+ run
             * @param {Array} affixes - array of affixes to check
             *
             * @return {Boolean} true iff all affixes are present in the run
             */
            console.assert(run.hasOwnProperty('affixes'), "'runContainsAffixes' was called with a run containing no 'affixes' field:", run);

            const present = run['affixes'].map((a) => a.name);
            return affixes.every((a) => present.includes(a));
        };

        let result = {};

        for (const answer of infos) {
            let player = answer.name;
            let runs = [];

            if (!result.hasOwnProperty(player)) {
                result[player] = {'Fortified': {}, 'Tyrannical': {}}
            }

            if (answer.hasOwnProperty('mythic_plus_best_runs')) {
                runs = answer.mythic_plus_best_runs;
            } else {
                runs = answer.mythic_plus_alternate_runs;
            }

            for (const run of runs) {
                const info = {
                    level: run['mythic_level'],
                    upgrades: run['num_keystone_upgrades'],
                };

                if (runContainsAffixes(run, [aff.FORTIFIED])) {
                    result[player][aff.FORTIFIED][run['dungeon']] = info
                } else {
                    result[player][aff.TYRANNICAL][run['dungeon']] = info
                }
            }
        }

        return result
    }
}
