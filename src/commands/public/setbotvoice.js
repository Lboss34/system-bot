const { 
    SlashCommandBuilder, 
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
    VoiceChannel,
    joinVoiceChannel,
    getVoiceConnection
} = require('discord.js');
const { 
    joinVoiceChannel: joinVoice, 
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    getVoiceConnection: getVoice,
    VoiceConnectionStatus,
    entersState
} = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setbotvoice')
        .setDescription('Set the bot to join a voice channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('Make the bot join a voice channel')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The voice channel to join')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildVoice)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription('Make the bot leave the current voice channel'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'join') {
            await handleJoinCommand(interaction);
        } else if (subcommand === 'leave') {
            await handleLeaveCommand(interaction);
        }
    }
};

async function handleJoinCommand(interaction) {
    try {
        const channel = interaction.options.getChannel('channel');
        
        // Check if channel is a voice channel
        if (channel.type !== ChannelType.GuildVoice) {
            return interaction.reply({
                content: '⚠️ يرجى اختيار قناة محادثة صوتية صالحة.',
                ephemeral: true
            });
        }
        
        // Leave any existing voice connection
        const existingConnection = getVoice(interaction.guild.id);
        if (existingConnection) {
            existingConnection.destroy();
        }
        
        // Join the voice channel
        const connection = joinVoice({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true
        });
        
        // Create a silent audio player to keep the bot in the channel
        const player = createAudioPlayer();
        connection.subscribe(player);
        
        // Handle connection errors
        connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                // Try to reconnect if disconnected
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
                // Connection is reconnecting
            } catch (error) {
                // Connection failed to reconnect, destroy it
                connection.destroy();
            }
        });
        
        // Send success message
        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('✅ تم الانضمام إلى القناة الصوتية')
            .setDescription(`✅ تم الانضمام إلى القناة الصوتية: **${channel.name}**`)
            .setTimestamp();
        
        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    } catch (error) {
        console.error('Error joining voice channel:', error);
        
        await interaction.reply({
            content: '⚠️ هناك خطأ في انضمام القناة الصوتية.',
            ephemeral: true
        });
    }
}

async function handleLeaveCommand(interaction) {
    try {
        // Get the current voice connection
        const connection = getVoice(interaction.guild.id);
        
        if (!connection) {
            return interaction.reply({
                content: '⚠️ أنا لست في قناة محادثة صوتية.',
                ephemeral: true
            });
        }
        
        // Destroy the connection
        connection.destroy();
        
        // Send success message
        const embed = new EmbedBuilder()
            .setColor('#e74c3c')
            .setTitle('✅ تم خروج القناة الصوتية')
            .setDescription('✅ تم خروج القناة الصوتية.')
            .setTimestamp();
        
        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    } catch (error) {
        console.error('Error leaving voice channel:', error);
        
        await interaction.reply({
            content: '⚠️ هناك خطأ في خروج القناة الصوتية.',
            ephemeral: true
        });
    }
} 