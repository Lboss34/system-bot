const { 
    SlashCommandBuilder, 
    EmbedBuilder 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('احصل على بطاقة معلومات شاملة لأي مستخدم في السيرفر، تشمل الرتب، الحالة، وتاريخ الانضمام.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('المستخدم الذي تريد عرض معلوماته (يتم اختيارك تلقائياً إذا لم تحدد)')
                .setRequired(false)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const roles = member ? member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r).join('، ') : 'لا يوجد';
        const joinedAt = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'غير متوفر';
        const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;
        await interaction.reply({
            embeds: [
                {
                    title: `معلومات المستخدم: ${user.tag}`,
                    thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
                    fields: [
                        { name: 'الاسم', value: user.username, inline: true },
                        { name: 'الآيدي', value: user.id, inline: true },
                        { name: 'تاريخ إنشاء الحساب', value: createdAt, inline: false },
                        { name: 'تاريخ دخول السيرفر', value: joinedAt, inline: false },
                        { name: 'الرتب', value: roles || 'لا يوجد', inline: false }
                    ],
                    color: 0x00bfae
                }
            ],
            ephemeral: true
        });
    },
};

// Format permission names for easier reading
function formatPermission(permission) {
    return permission
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, match => match.toUpperCase())
        .trim();
} 