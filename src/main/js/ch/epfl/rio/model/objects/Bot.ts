import { Client } from 'discord.js';

require('dotenv').config();

const { Intents } = require('discord.js');

import QueryManager from '../network/manager';
import { handleCommBest, handleCommExec, handleCommInfo, handleCommNeed, handleCommPing } from '../network/client';

const com = require('../../../../../../res/command.json');


export default class Bot {
  private readonly client: Client;
  private readonly queryManager: QueryManager;

  constructor() {
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
      ]
    });

    this.queryManager = new QueryManager();

    this.init();
    this.login();
  }

  init() {
    this.client.on('ready', () => {
      console.log(`INF – logged in as ${this.client.user!.tag}`)
    });

    this.client.on('messageCreate', (msg) => {
      let content = msg.content;
      if (content === `${com.__SEP__}${com.PING}`) {
        handleCommPing().then((s: string) => msg.reply(s));
      } else if (content === `${com.__SEP__}${com.INFO}`) {
        handleCommInfo().then((s: string) => msg.reply(s));
      } else if (content.startsWith(`${com.__SEP__}${com.TABLE_EXEC}`)) {
        handleCommExec(content.split(' '), this.queryManager).then((s: string) => msg.reply(s));
      } else if (content.startsWith(`${com.__SEP__}${com.TABLE_BEST}`)) {
        handleCommBest(content.split(' '), this.queryManager).then((s: string) => msg.reply(s));
      } else if (content.startsWith(`${com.__SEP__}${com.TABLE_NEED}`)) {
        handleCommNeed(content.split(' '), this.queryManager).then((s: string) => msg.reply(s));
      }
    });
  }

  login() {
    this.client.login(process.env.BOT_TOKEN);
  }
}
