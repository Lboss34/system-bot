const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Toggle replay mode for the current track'),
    cooldown: 5,

    async execute(interaction, client) {
        try {
            // Check if user is in a voice channel
            const voiceChannel = interaction.member.voice.channel;
            if (!voiceChannel) {
                if (interaction.replied || interaction.deferred) {
                    return interaction.editReply({
                        content: '❌ | يجب أن تكون في قناة صوتية لاستخدام هذا الأمر!',
                        ephemeral: true
                    });
                } else {
                    return interaction.reply({
                        content: '❌ | يجب أن تكون في قناة صوتية لاستخدام هذا الأمر!',
                        ephemeral: true
                    });
                }
            }

            // Get the queue
            const queue = global.player.nodes.get(interaction.guildId);
            if (!queue || !queue.isPlaying()) {
                if (interaction.replied || interaction.deferred) {
                    return interaction.editReply({
                        content: '❌ | لا يوجد موسيقى تعمل حالياً!',
                        ephemeral: true
                    });
                } else {
                    return interaction.reply({
                        content: '❌ | لا يوجد موسيقى تعمل حالياً!',
                        ephemeral: true
                    });
                }
            }

            // Toggle replay mode
            queue.setRepeatMode(queue.repeatMode === 1 ? 0 : 1);

            // Create an embed to show the status
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle('🔁 وضع إعادة التشغيل')
                .setDescription(`وضع إعادة التشغيل الآن ${queue.repeatMode === 1 ? '**مفعل**' : '**متوقف**'}`)
                .addFields(
                    { name: 'المقطع الحالي', value: `[${queue.currentTrack.title}](${queue.currentTrack.url})`, inline: true }
                )
                .setTimestamp();

            // Add the current track thumbnail if available
            if (queue.currentTrack.thumbnail) {
                embed.setThumbnail(queue.currentTrack.thumbnail);
            }

            if (interaction.replied || interaction.deferred) {
                return interaction.editReply({ embeds: [embed] });
            } else {
                return interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error in replay command:', error);
            if (interaction.replied || interaction.deferred) {
                return interaction.editReply({
                    content: `❌ | خطأ: ${error.message}`,
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    content: `❌ | خطأ: ${error.message}`,
                    ephemeral: true
                });
            }
        }
    },
};
