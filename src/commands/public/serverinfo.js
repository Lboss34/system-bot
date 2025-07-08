const { 
    SlashCommandBuilder, 
    EmbedBuilder 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('استعرض كل تفاصيل السيرفر: عدد الأعضاء، الرتب، القنوات، البوستات، والمزيد بشكل منسق.'),
    
    async execute(interaction) {
        const { guild } = interaction;
        await guild.fetch();
        const owner = await guild.fetchOwner();
        const createdAt = `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`;
        const members = await guild.members.fetch();
        const onlineCount = members.filter(m => m.presence && m.presence.status !== 'offline').size;
        const botCount = members.filter(m => m.user.bot).size;
        const humanCount = members.size - botCount;
        const roles = guild.roles.cache.filter(r => r.id !== guild.id).map(r => r).join('، ');
        await interaction.reply({
            embeds: [
                {
                    title: `معلومات السيرفر: ${guild.name}`,
                    thumbnail: { url: guild.iconURL({ dynamic: true }) },
                    fields: [
                        { name: 'المالك', value: `${owner.user.tag} (${owner.id})`, inline: true },
                        { name: 'تاريخ الإنشاء', value: createdAt, inline: true },
                        { name: 'عدد الأعضاء', value: `${members.size} (أونلاين: ${onlineCount})`, inline: true },
                        { name: 'عدد البوتات', value: `${botCount}`, inline: true },
                        { name: 'عدد البشر', value: `${humanCount}`, inline: true },
                        { name: 'عدد الرتب', value: `${guild.roles.cache.size - 1}`, inline: true },
                        { name: 'الرتب', value: roles || 'لا يوجد', inline: false }
                    ],
                    color: 0x00bfae
                }
            ],
            ephemeral: true
        });
    },
};

// Format server feature names for easier reading
function formatFeature(feature) {
    return feature
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
} 