const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		if (interaction.commandName === 'ping') {
			await interaction.reply('Pong!');
		}
	},
};


//note: use defferred responses for chatgpt