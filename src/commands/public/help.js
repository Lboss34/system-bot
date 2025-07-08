const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Helper function to show commands in a specific category
async function showCategoryCommands(interaction, category, client) {
    // Get commands in the category
    const commandsPath = path.join(__dirname, '..', category);
    let commandFiles;
    
    try {
        commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    } catch (error) {
        // Handle different interaction types for errors
        if (interaction.isButton() || interaction.isStringSelectMenu()) {
            return interaction.update({ 
                content: `فئة "${category}" غير موجودة أو لا تحتوي على أوامر.`, 
                embeds: [],
                components: []
            });
        } else {
            return interaction.reply({ 
                content: `فئة "${category}" غير موجودة أو لا تحتوي على أوامر.`, 
                ephemeral: true 
            });
        }
    }
    
    // Create embed based on category
    const categoryIcons = {
        public: '📚',
        games: '🎮',
        tickets: '🎫',
        giveaway: '🎉',
        moderation: '🛡️',
        music: '🎵'
    };
    
    const categoryNames = {
        public: 'الأوامر العامة',
        games: 'أوامر الألعاب',
        tickets: 'أوامر التذاكر',
        giveaway: 'أوامر المسابقات',
        moderation: 'أوامر الإدارة',
        music: 'أوامر الموسيقى'
    };

    const categoryColors = {
        public: '#3498db',
        games: '#2ecc71',
        tickets: '#9b59b6',
        giveaway: '#f1c40f',
        moderation: '#e74c3c',
        music: '#8e44ad'
    };
    
    const embed = new EmbedBuilder()
        .setColor(categoryColors[category] || '#3498db')
        .setTitle(`${categoryIcons[category] || '📚'} ${categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
        .setDescription(`إليك الأوامر المتاحة في فئة ${categoryNames[category] ? categoryNames[category] : category}:`)
        .setFooter({ text: `${client.user.username} | استخدم /help <أمر> للحصول على تفاصيل أمر محدد`, iconURL: client.user.displayAvatarURL() });
    
    // جدول الأوصاف العربية الاحترافية للأوامر
    const arabicDescriptions = {
        ping: 'يعرض سرعة استجابة البوت وزمن الاتصال بخوادم ديسكورد بدقة لحظية.',
        userinfo: 'احصل على بطاقة معلومات شاملة لأي مستخدم في السيرفر، تشمل الرتب، الحالة، وتاريخ الانضمام.',
        serverinfo: 'استعرض كل تفاصيل السيرفر: عدد الأعضاء، الرتب، القنوات، البوستات، والمزيد بشكل منسق.',
        help: 'قائمة تفاعلية بجميع أوامر البوت مع شرح مبسط لكل أمر، لتسهيل الوصول والبحث.',
        athkar: 'يعرض لك أذكار الصباح والمساء والأدعية المختارة مع إمكانية التنقل بينها بسهولة.',
        play: 'شغل أي أغنية أو مقطع صوتي من يوتيوب أو روابط مباشرة في الروم الصوتي بجودة عالية.',
        stop: 'إيقاف تشغيل الموسيقى فوراً وخروج البوت من الروم الصوتي.',
        queue: 'اعرض قائمة الانتظار الحالية للأغاني مع تفاصيل كل مقطع.',
        skip: 'تخطى الأغنية الحالية وشغل التالية في قائمة الانتظار.',
        pause: 'أوقف الموسيقى مؤقتاً مع إمكانية الاستئناف لاحقاً.',
        resume: 'استئناف تشغيل الموسيقى بعد الإيقاف المؤقت.',
        volume: 'تحكم في مستوى صوت الموسيقى في الروم الصوتي بسهولة.',
        feedback: 'أرسل اقتراحاتك أو ملاحظاتك مباشرة لإدارة السيرفر بسرية واحترافية.',
        profile: 'اعرض بروفايلك أو بروفايل أي عضو آخر مع الإحصائيات والإنجازات.',
        ticket: 'أنشئ تذكرة دعم أو استفسار ليتم متابعتها من قبل فريق الإدارة.',
        giveaway: 'أنشئ مسابقة أو سحب عشوائي للأعضاء مع خيارات متقدمة للتحكم.',
        ban: 'حظر عضو من السيرفر مع توضيح السبب وتوثيق العملية.',
        kick: 'طرد عضو من السيرفر بشكل فوري مع إمكانية ذكر السبب.',
        timeout: 'إسكات عضو لفترة محددة مع رسالة توضيحية تلقائية.',
        autorole: 'إعداد توزيع الرتب التلقائي للأعضاء الجدد عند دخولهم السيرفر.',
        invites: 'اعرض إحصائيات دعواتك وعدد الأعضاء الذين دخلوا عبر رابطك.',
        setbotvoice: 'اجعل البوت ينضم إلى روم صوتي محدد أو يغادره.',
        setup: 'إعداد خصائص البوت في السيرفر بسهولة.',
        botstatus: 'تغيير حالة البوت (متصل، مشغول، إلخ) مع نص مخصص.',
        autoathkar: 'إعداد الأذكار التلقائية في روم معين مع خيارات متقدمة.',
        embedbuilder: 'أنشئ رسائل إمبد مخصصة وملونة لأي قناة.',
        // أضف بقية الأوامر هنا بنفس الأسلوب...
    };

    // Add each command to the embed
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.data && command.data.name) {
            // استخدم الوصف العربي الاحترافي إذا وجد، وإلا استخدم الوصف الأصلي أو 'لا يوجد وصف'
            let commandDescription = arabicDescriptions[command.data.name] || command.data.description || 'لا يوجد وصف';
            
            // Handle subcommands
            if (command.data.options && command.data.options.some(opt => opt.type === 1)) {
                // If has subcommands, just list main command and suggest viewing details
                commandDescription += `\n*استخدم \`/help ${command.data.name}\` لرؤية الأوامر الفرعية*`;
            }
            
            embed.addFields({ name: `/${command.data.name}`, value: commandDescription });
        }
    }
    
    // Create navigation components
    const categoryRow = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_category_menu')
                .setPlaceholder('Select a command category')
                .addOptions([
                    { label: 'الأوامر العامة', description: 'أوامر عامة ومفيدة', value: 'public', emoji: '📚' },
                    { label: 'أوامر الألعاب', description: 'ألعاب ممتعة للعب في السيرفر', value: 'games', emoji: '🎮' },
                    { label: 'أوامر التذاكر', description: 'نظام تذاكر الدعم', value: 'tickets', emoji: '🎫' },
                    { label: 'أوامر المسابقات', description: 'إنشاء وإدارة المسابقات', value: 'giveaway', emoji: '🎉' },
                    { label: 'أوامر الإدارة', description: 'حماية وتنظيم السيرفر', value: 'moderation', emoji: '🛡️' },
                    { label: 'أوامر الموسيقى', description: 'تشغيل الموسيقى في الرومات الصوتية', value: 'music', emoji: '🎵' }
                ])
        );
    
    const buttonsRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('help_home')
                .setLabel('الرئيسية')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🏠'),
            new ButtonBuilder()
                .setCustomId('help_all')
                .setLabel('جميع الأوامر')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📋'),
            new ButtonBuilder()
                .setURL('https://discord.gg/support')  // Replace with your actual support server link
                .setLabel('سيرفر الدعم')
                .setStyle(ButtonStyle.Link)
                .setEmoji('🔗')
        );
    
    // Handle different types of interactions بشكل صحيح
    if (interaction.isButton && interaction.isButton()) {
        return interaction.update({ embeds: [embed], components: [categoryRow, buttonsRow] });
    } else if (interaction.isStringSelectMenu && interaction.isStringSelectMenu()) {
        return interaction.update({ embeds: [embed], components: [categoryRow, buttonsRow] });
    } else if (interaction.replied || interaction.deferred) {
        return interaction.editReply({ embeds: [embed], components: [categoryRow, buttonsRow] });
    } else {
        return interaction.reply({ embeds: [embed], components: [categoryRow, buttonsRow], ephemeral: true });
    }
}

// Helper function to show detailed help for a specific command
async function showCommandHelp(interaction, commandName, client) {
    // Search for the command in all categories
    const categories = ['public', 'games', 'tickets', 'giveaway', 'moderation', 'music'];
    let commandFound = false;
    let commandData = null;
    let commandPath = '';
    
    // Look for the command in each category
    for (const category of categories) {
        const categoryPath = path.join(__dirname, '..', category);
        
        try {
            const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
            
            for (const file of files) {
                const command = require(path.join(categoryPath, file));
                
                if (command.data && command.data.name === commandName) {
                    commandFound = true;
                    commandData = command.data;
                    commandPath = `${category}/${file}`;
                    break;
                }
            }
            
            if (commandFound) break;
        } catch (error) {
            // Skip if directory doesn't exist
            continue;
        }
    }
    
    if (!commandFound) {
        // Handle different interaction types for errors
        if (interaction.isButton() || interaction.isStringSelectMenu()) {
            return interaction.update({ 
                content: `الأمر "${commandName}" غير موجود.`, 
                embeds: [],
                components: []
            });
        } else {
            return interaction.reply({
                content: `الأمر "${commandName}" غير موجود.`,
                ephemeral: true
            });
        }
    }
    
    // Build the command help embed
    const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle(`الأمر: /${commandName}`)
        .setDescription(commandData.description || 'لا يوجد وصف');
    
    // Add command options if they exist
    if (commandData.options && commandData.options.length > 0) {
        // Check if command has subcommands
        const hasSubCommands = commandData.options.some(option => option.type === 1);
        
        if (hasSubCommands) {
            // Handle subcommands display
            embed.addFields({ name: '🔹 الأوامر الفرعية', value: '\u200B' });
            
            for (const option of commandData.options) {
                if (option.type === 1) { // Subcommand
                    let subcommandText = option.description || 'No description provided';
                    
                    // Add subcommand options if they exist
                    if (option.options && option.options.length > 0) {
                        subcommandText += '\n**الخيارات:**';
                        for (const subOption of option.options) {
                            subcommandText += `\n• \`${subOption.name}\`: ${subOption.description || 'لا يوجد وصف'}`;
                            if (subOption.required) subcommandText += ' *(مطلوب)*';
                        }
                    }
                    
                    embed.addFields({ name: `/${commandName} ${option.name}`, value: subcommandText });
                }
            }
        } else {
            // Handle regular command options
            let optionsText = '';
            
            for (const option of commandData.options) {
                optionsText += `• \`${option.name}\`: ${option.description || 'لا يوجد وصف'}`;
                if (option.required) optionsText += ' *(مطلوب)*';
                optionsText += '\n';
                
                // If the option has choices, list them
                if (option.choices && option.choices.length > 0) {
                    optionsText += '  **الخيارات:** ';
                    optionsText += option.choices.map(choice => `\`${choice.name}\``).join(', ');
                    optionsText += '\n';
                }
            }
            
            if (optionsText) {
                embed.addFields({ name: '🔹 الخيارات', value: optionsText });
            }
        }
    }
    
    // Add source file info
    embed.addFields({ name: '🔹 الملف المصدر', value: `\`${commandPath}\`` });
    
    // Set footer with bot info
    embed.setFooter({ text: `${client.user.username} | استخدم /help لرؤية جميع الأوامر`, iconURL: client.user.displayAvatarURL() });
    
    // Create button to go back to help menu
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('help_home')
                .setLabel('العودة للقائمة الرئيسية')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔙')
        );
    
    // Handle different types of interactions
    if (interaction.isButton() || interaction.isStringSelectMenu()) {
        return interaction.update({ embeds: [embed], components: [row] });
    } else if (interaction.replied || interaction.deferred) {
        return interaction.editReply({ embeds: [embed], components: [row] });
    } else {
        return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
}

const helpCommand = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('قائمة تفاعلية بجميع أوامر البوت مع شرح مبسط لكل أمر، لتسهيل الوصول والبحث.')
        .addStringOption(option => 
            option.setName('category')
                .setDescription('اختر فئة الأوامر لعرضها')
                .setRequired(false)
                .addChoices(
                    { name: 'الأوامر العامة', value: 'public' },
                    { name: 'أوامر الألعاب', value: 'games' },
                    { name: 'أوامر التذاكر', value: 'tickets' },
                    { name: 'أوامر المسابقات', value: 'giveaway' },
                    { name: 'أوامر الإدارة', value: 'moderation' },
                    { name: 'أوامر الموسيقى', value: 'music' }
                ))
        .addStringOption(option =>
            option.setName('command')
                .setDescription('الحصول على شرح مفصل لأمر معين')
                .setRequired(false)),
    
    async execute(interaction, client) {
        // دعم جميع أنواع التفاعل (أمر، زر، قائمة منسدلة)
        let category = null;
        let command = null;

        // إذا كان أمر سلاش
        if (interaction.isChatInputCommand && interaction.isChatInputCommand()) {
            category = interaction.options.getString('category');
            command = interaction.options.getString('command');
        }
        // إذا كان زر أو قائمة منسدلة
        else if (interaction.isButton && interaction.isButton()) {
            if (interaction.customId && interaction.customId.startsWith('help_category_')) {
                category = interaction.customId.replace('help_category_', '');
            }
        } else if (interaction.isStringSelectMenu && interaction.isStringSelectMenu()) {
            if (interaction.values && interaction.values[0]) {
                category = interaction.values[0];
            }
        }

        // إذا طلب شرح أمر محدد
        if (command) {
            return await module.exports.showCommandHelp(interaction, command, client || interaction.client);
        }
        // إذا طلب فئة محددة
        if (category) {
            return await module.exports.showCategoryCommands(interaction, category, client || interaction.client);
        }
        // القائمة الرئيسية
        return await module.exports.showCategoryCommands(interaction, 'public', client || interaction.client);
    },

    // Export helper functions
    showCategoryCommands,
    showCommandHelp
};

module.exports = helpCommand; 