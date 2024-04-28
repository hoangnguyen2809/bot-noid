const fs = require('node:fs');
const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Lists all available commands'),
	async execute(client, interaction) {
        const foldersPath = path.dirname(__dirname);
        const commandFolders = fs.readdirSync(foldersPath);

        const embed = new EmbedBuilder()
            .setDescription('Here is a list of all available commands!')
            .setThumbnail(client.user.displayAvatarURL()) // https://imgur.com/a/pSTWJcy
            .setFooter({ text: 'Developed by hoangnguyen2809 https://github.com/hoangnguyen2809/meap'})
            for (const folder of commandFolders) {
                if (folder === 'utility') continue;
                const commandsPath = path.join(foldersPath, folder);
                const commandFiles = fs.readdirSync(commandsPath) .filter(file => file.endsWith('.js') && file !== 'help.js')
                embed.addFields({name: `${folder}:`, value: " ", inline: false})
                for(const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    const command = require(filePath);
                    embed.addFields({ name: "/" + command.data.name, value: command.data.description});
                }
            }


        await interaction.reply({ embeds: [embed] });
	},  
};


//note: use defferred responses for chatgpt