const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(client, interaction) {
		if (interaction.commandName === 'ping') {
			await interaction.reply('Pong!');
		}
	},
};


//note: use defferred responses for chatgpt