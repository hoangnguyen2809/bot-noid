const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")
const { joinVoiceChannel, createAudioPlayer, createAudioResource, } = require('@discordjs/voice');
const { createDiscordJSAdapter } = require('@discordjs/voice');

module.exports = {
    category: 'Music',
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("play a song")
		.addStringOption(option =>
            option.setName("input")
                .setDescription("song/playlist's name or url")
                .setRequired(true)),
	async execute(client, interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply("You need to be in a voice channel to use this command.");
        }
        
        const query = interaction.options.getString("input");

        const searchResult = await client.player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });


        if (!searchResult || !searchResult.tracks.length) {
            return interaction.reply("No search results found.");
        }

        console.log(searchResult.tracks.length);


        console.log(searchResult.tracks[0]);
        const queue = client.player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.channel,
            },
        });
        joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        })
        
    },

};