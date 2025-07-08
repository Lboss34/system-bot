const { 
    SlashCommandBuilder, 
    EmbedBuilder,
    PermissionFlagsBits,
    ActivityType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botstatus')
        .setDescription('Change the bot\'s status')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The status to set for the bot')
                .setRequired(true)
                .addChoices(
                    { name: 'Online', value: 'online' },
                    { name: 'Idle', value: 'idle' },
                    { name: 'Do Not Disturb', value: 'dnd' },
                    { name: 'Invisible', value: 'invisible' }
                ))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of status activity')
                .setRequired(false)
                .addChoices(
                    { name: 'Playing', value: 'PLAYING' },
                    { name: 'Watching', value: 'WATCHING' },
                    { name: 'Listening', value: 'LISTENING' },
                    { name: 'Competing', value: 'COMPETING' }
                ))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The status text to display')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const uptime = Math.floor(process.uptime());
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        await interaction.reply({
            embeds: [
                {
                    title: 'حالة البوت',
                    description: `⏱️ مدة التشغيل: **${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية**\n💾 الذاكرة المستخدمة: **${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB**`,
                    color: 0x00bfae
                }
            ],
            ephemeral: true
        });
    },
};

// Helper function to convert string activity type to ActivityType enum
function getActivityType(typeString) {
    switch (typeString) {
        case 'PLAYING':
            return ActivityType.Playing;
        case 'WATCHING':
            return ActivityType.Watching;
        case 'LISTENING':
            return ActivityType.Listening;
        case 'COMPETING':
            return ActivityType.Competing;
        default:
            return ActivityType.Playing;
    }
} 