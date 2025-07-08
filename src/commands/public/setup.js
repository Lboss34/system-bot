const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    StringSelectMenuBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Set up bot features in this server')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of setup to create')
                .setRequired(true)
                .addChoices(
                    { name: 'Games Panel', value: 'games' },
                    { name: 'Utility Panel', value: 'utility' },
                    { name: 'Welcome Message', value: 'welcome' },
                    { name: 'Information Panel', value: 'info' }
                ))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the setup to (defaults to current channel)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    
    async execute(interaction, client) {
        const setupType = interaction.options.getString('type');
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        
        switch (setupType) {
            case 'games':
                await setupGamesPanel(interaction, channel);
                break;
            case 'utility':
                await setupUtilityPanel(interaction, channel);
                break;
            case 'welcome':
                await setupWelcomeMessage(interaction, channel);
                break;
            case 'info':
                await setupInfoPanel(interaction, channel);
                break;
        }
    },
};

// Set up a games panel
async function setupGamesPanel(interaction, channel) {
    try {
        const embed = new EmbedBuilder()
            .setColor('#e74c3c')
            .setTitle('🎮 Fun & Games')
            .setDescription('Select a game to play from the dropdown menu below!')
            .addFields(
                { name: '🎲 Board Games', value: 'Challenge your friends to Tic Tac Toe or Connect4' },
                { name: '🎯 Word Games', value: 'Test your skills with Hangman or Word Search' },
                { name: '🧩 Puzzle Games', value: 'Challenge yourself with quizzes and memory games' },
                { name: '🎪 Quick Games', value: 'Have a quick game with dice rolls and coin flips' }
            )
            .setFooter({ text: 'Use the dropdown menu or buttons below to play games!' });
        
        // Create dropdown menu for games
        const gamesMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('game_select')
                    .setPlaceholder('Select a game to play')
                    .addOptions([
                        {
                            label: 'Tic Tac Toe',
                            description: 'Challenge a friend to Tic Tac Toe',
                            value: 'tictactoe',
                            emoji: '❌'
                        },
                        {
                            label: 'Connect 4',
                            description: 'Play Connect 4 with a friend',
                            value: 'connect4',
                            emoji: '🔴'
                        },
                        {
                            label: 'Hangman',
                            description: 'Play a game of Hangman',
                            value: 'hangman',
                            emoji: '🪢'
                        },
                        {
                            label: 'Word Search',
                            description: 'Find hidden words in a puzzle',
                            value: 'wordsearch',
                            emoji: '🔍'
                        },
                        {
                            label: 'Trivia',
                            description: 'Test your knowledge with trivia questions',
                            value: 'trivia',
                            emoji: '❓'
                        }
                    ])
            );
        
        // Create quick game buttons
        const quickGamesRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('coinflip')
                    .setLabel('Coin Flip')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🪙'),
                new ButtonBuilder()
                    .setCustomId('dice')
                    .setLabel('Roll Dice')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎲'),
                new ButtonBuilder()
                    .setCustomId('rps')
                    .setLabel('Rock Paper Scissors')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('✂️')
            );
        
        await channel.send({
            embeds: [embed],
            components: [gamesMenu, quickGamesRow]
        });
        
        await interaction.reply({
            content: `✅ تم إعداد لوحة ألعاب في <#${channel.id}>!`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Error setting up games panel:', error);
        await interaction.reply({
            content: 'حدث خطأ أثناء إعداد لوحة ألعاب.',
            ephemeral: true
        });
    }
}

// Set up a utility panel
async function setupUtilityPanel(interaction, channel) {
    try {
        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('🛠️ Utility Panel')
            .setDescription('Quick access to useful bot functions')
            .addFields(
                { name: '🎫 Support Tickets', value: 'Create a support ticket for assistance' },
                { name: '📊 Server Stats', value: 'View server statistics and information' },
                { name: '👤 User Info', value: 'View your profile information' },
                { name: '🔗 Invite Tracker', value: 'Check who invited new members' }
            )
            .setFooter({ text: 'Click the buttons below to use these features' });
        
        // Create utility buttons
        const utilityRow1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Create Ticket')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🎫'),
                new ButtonBuilder()
                    .setCustomId('server_info')
                    .setLabel('Server Info')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📊')
            );
        
        const utilityRow2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('user_info')
                    .setLabel('User Info')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('👤'),
                new ButtonBuilder()
                    .setCustomId('invite_leaderboard')
                    .setLabel('Invite Leaderboard')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔗')
            );
        
        await channel.send({
            embeds: [embed],
            components: [utilityRow1, utilityRow2]
        });
        
        await interaction.reply({
            content: `✅ تم إعداد لوحة أدوات في <#${channel.id}>!`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Error setting up utility panel:', error);
        await interaction.reply({
            content: 'حدث خطأ أثناء إعداد لوحة أدوات.',
            ephemeral: true
        });
    }
}

// Set up a welcome message (example)
async function setupWelcomeMessage(interaction, channel) {
    try {
        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle(`Welcome to ${interaction.guild.name}!`)
            .setDescription('We\'re glad to have you here. Please take a moment to familiarize yourself with our server.')
            .addFields(
                { name: '📜 Rules', value: 'Please read our rules in the rules channel.' },
                { name: '🎭 Roles', value: 'Get roles in the roles channel.' },
                { name: '💬 Support', value: 'If you need help, create a ticket using the button below.' }
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
            .setFooter({ text: 'We hope you enjoy your stay!' });
        
        // Create welcome buttons
        const welcomeRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Get Support')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🎫'),
                new ButtonBuilder()
                    .setCustomId('server_info')
                    .setLabel('Server Info')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📊')
            );
        
        await channel.send({
            embeds: [embed],
            components: [welcomeRow]
        });
        
        await interaction.reply({
            content: `✅ تم إعداد رسالة الترحيب في <#${channel.id}>!`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Error setting up welcome message:', error);
        await interaction.reply({
            content: 'حدث خطأ أثناء إعداد رسالة الترحيب.',
            ephemeral: true
        });
    }
}

// Set up an info panel
async function setupInfoPanel(interaction, channel) {
    try {
        const embed = new EmbedBuilder()
            .setColor('#9b59b6')
            .setTitle('ℹ️ Bot Information')
            .setDescription('Information about this Discord bot and its features')
            .addFields(
                { name: '🤖 Bot Features', value: 'Ticket System, Giveaways, Games, Moderation, and much more!' },
                { name: '🔧 Configuration', value: 'Server administrators can configure the bot using the `/setup` command.' },
                { name: '📚 Help', value: 'Use `/help` to see all available commands.' },
                { name: '🔗 Support', value: 'If you need help, create a ticket or contact the server administrators.' }
            )
            .setFooter({ text: 'Thanks for using our bot!' });
        
        // Create info buttons
        const infoRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('help_menu')
                    .setLabel('Help Menu')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📚'),
                new ButtonBuilder()
                    .setCustomId('bot_info')
                    .setLabel('Bot Stats')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📊')
            );
        
        await channel.send({
            embeds: [embed],
            components: [infoRow]
        });
        
        await interaction.reply({
            content: `✅ تم إعداد لوحة المعلومات في <#${channel.id}>!`,
            ephemeral: true
        });
    } catch (error) {
        console.error('Error setting up info panel:', error);
        await interaction.reply({
            content: 'حدث خطأ أثناء إعداد لوحة المعلومات.',
            ephemeral: true
        });
    }
} 