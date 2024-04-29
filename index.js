const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js');
const { Client, Collection, Events, GatewayIntentBits, IntentsBitField  } = require('discord.js');
const { Player } = require('discord-player');
const { token } = require('./config.json');
const { YouTubeExtractor } = require('@discord-player/extractor');
const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());

// Create a new client instance
const client = new Client({
	intents: [
	  Discord.GatewayIntentBits.Guilds,
	  Discord.GatewayIntentBits.GuildMembers,
	  Discord.GatewayIntentBits.GuildMessages,
	  Discord.GatewayIntentBits.MessageContent,
	  Discord.GatewayIntentBits.GuildVoiceStates
	]
  });

client.commands = new Collection();
client.player = new Player(client);
client.player.extractors.loadDefault();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.cooldowns = new Collection();
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.login(token);