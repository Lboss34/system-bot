const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('يعرض سرعة استجابة البوت وزمن الاتصال بخوادم ديسكورد بدقة لحظية.'),
    
    async execute(interaction) {
        const sent = await interaction.reply({ content: '🏓 جاري قياس سرعة البوت...', fetchReply: true, ephemeral: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply({
            content: null,
            embeds: [
                {
                    title: 'إحصائيات سرعة البوت',
                    description: `• سرعة استجابة البوت: **${latency}ms**\n• سرعة اتصال API: **${Math.round(interaction.client.ws.ping)}ms**`,
                    color: 0x00bfae
                }
            ]
        });
    },
}; 