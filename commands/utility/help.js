const fs = require('node:fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Lists all available commands'),
	async execute(client, interaction) {
        console.log("errorororor");
        const commandsPath = __dirname;
        console.log(commandsPath);
        const commandFiles = fs.readdirSync(commandsPath) .filter(file => file.endsWith('.js') && file !== 'help.js')
        console.log(commandFiles);

        const embed = new EmbedBuilder()
            .setDescription('Command list:')
            .setThumbnail(client.user.displayAvatarURL())

            for(const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                console.log(filePath)
                const command = require(filePath);
                embed.addFields({name: "/"+command.data.name,  value: command.data.description})
            }

        await interaction.reply({ embeds: [embed] });
	},  
};


//note: use defferred responses for chatgpt