const { SlashCommandBuilder } = require('discord.js');
const {dev } = require('../../config.json');
const path = require('path');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command. Only accessible as devs')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async execute(client, interaction) {
		if (!dev.includes(interaction.user.id)) {
			return interaction.reply({content: 'You do not have permission to use this command!', ephemeral: true});
		}
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`There is no command with name \`${commandName}\`!`);
		}

		const commandPath = path.resolve(__dirname, '..', command.category, `${command.data.name}.js`);
		delete require.cache[require.resolve(commandPath)];

		try {
			interaction.client.commands.delete(command.data.name);
			const newCommand = require(`../${command.category}/${command.data.name}.js`);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply({content: `Command \`${newCommand.data.name}\` was reloaded!`, ephemeral: true });
		} catch (error) {
			console.error(error);
			await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
	},
};