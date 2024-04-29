const { SlashCommandBuilder } = require("@discordjs/builders")
const { QueryType, useMainPlayer, useQueue } = require('discord-player');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus} = require('@discordjs/voice');
const { EmbedBuilder, Permissions, PermissionsBitField   } = require('discord.js');

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

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Connect) || !interaction.member.permissions.has(PermissionsBitField.Flags.SPEAK)) {
            return interaction.reply("I don't have permission to speak in that voice channel.");
        }

        const query = interaction.options.getString("input");
        const searchResult = await client.player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        const NoResultsEmbed = new EmbedBuilder()
            .setAuthor({ name: `No results found... try again ?`})

        if (!searchResult || !searchResult.tracks.length) {
            return interaction.editReply({ embeds: [NoResultsEmbed] });
        }
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.member.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        connection.on('stateChange', (oldState, newState) => {
            console.log(`Voice state changed: ${oldState.status} -> ${newState.status}`);
        });
        
        const player = createAudioPlayer();
        const resource = createAudioResource(searchResult.tracks[0].url);
        //console.log(resource);
        
        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log('The audio player has started playing!');
        });
        player.on('error', error => {
            console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
            player.play(getNextResource());
        });

        await interaction.reply(`Now playing: ${searchResult.tracks[0].title}`);
    },

};