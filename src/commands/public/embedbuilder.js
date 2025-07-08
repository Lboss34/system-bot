const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embedbuilder')
        .setDescription('Create and send custom embeds to any channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new custom embed'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edit an existing embed')
                .addStringOption(option =>
                    option.setName('message_id')
                        .setDescription('The message ID of the embed to edit')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel where the embed is located')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('template')
                .setDescription('Use a premade embed template')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('The type of template to use')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Announcement', value: 'announcement' },
                            { name: 'Welcome', value: 'welcome' },
                            { name: 'Rules', value: 'rules' },
                            { name: 'Information', value: 'info' },
                            { name: 'Poll', value: 'poll' }
                        )))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        
        switch (subcommand) {
            case 'create':
                await handleCreateEmbed(interaction, client);
                break;
            case 'edit':
                await handleEditEmbed(interaction, client);
                break;
            case 'template':
                await handleTemplateEmbed(interaction, client);
                break;
        }
    },
};

// Handle creating a new embed
async function handleCreateEmbed(interaction, client) {
    // Show the embed builder modal
    const modal = new ModalBuilder()
        .setCustomId('embed_builder_modal')
        .setTitle('Create Custom Embed');
    
    // Add title input
    const titleInput = new TextInputBuilder()
        .setCustomId('embed_title')
        .setLabel('Embed Title')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter a title for your embed')
        .setRequired(false)
        .setMaxLength(256);
    
    // Add description input
    const descriptionInput = new TextInputBuilder()
        .setCustomId('embed_description')
        .setLabel('Embed Description')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Enter a description for your embed')
        .setRequired(false)
        .setMaxLength(4000);
    
    // Add color input
    const colorInput = new TextInputBuilder()
        .setCustomId('embed_color')
        .setLabel('Embed Color (hex code)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('#3498db')
        .setRequired(false)
        .setMaxLength(7);
    
    // Add footer input
    const footerInput = new TextInputBuilder()
        .setCustomId('embed_footer')
        .setLabel('Embed Footer')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter text for the footer')
        .setRequired(false)
        .setMaxLength(2048);
    
    // Add image URL input
    const imageInput = new TextInputBuilder()
        .setCustomId('embed_image')
        .setLabel('Image URL (optional)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('https://example.com/image.png')
        .setRequired(false);
    
    // Create action rows
    const titleRow = new ActionRowBuilder().addComponents(titleInput);
    const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput);
    const colorRow = new ActionRowBuilder().addComponents(colorInput);
    const footerRow = new ActionRowBuilder().addComponents(footerInput);
    const imageRow = new ActionRowBuilder().addComponents(imageInput);
    
    // Add inputs to the modal
    modal.addComponents(titleRow, descriptionRow, colorRow, footerRow, imageRow);
    
    // Show the modal
    await interaction.showModal(modal);
}

// Handle editing an existing embed
async function handleEditEmbed(interaction, client) {
    try {
        const messageId = interaction.options.getString('message_id');
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        
        // Check if channel is a text channel
        if (!channel.isTextBased()) {
            return interaction.reply({
                content: 'القناة المحددة غير صالحة! يجب أن تكون قناة حرفية.',
                ephemeral: true
            });
        }
        
        // Fetch the message
        let message;
        try {
            message = await channel.messages.fetch(messageId);
        } catch (error) {
            return interaction.reply({
                content: 'لم يتم العثور على رسالة بهذا المعرف في القناة المحددة.',
                ephemeral: true
            });
        }
        
        // Check if the message has an embed
        if (!message.embeds || message.embeds.length === 0) {
            return interaction.reply({
                content: 'الرسالة المحددة غير تحتوي على مضمن!',
                ephemeral: true
            });
        }
        
        // Check if the message was sent by the bot
        if (message.author.id !== client.user.id) {
            return interaction.reply({
                content: 'يمكنني فقط تعديل المضمنات التي تم إنشاؤها بواسطتي.',
                ephemeral: true
            });
        }
        
        // Create modal with the existing embed values
        const embed = message.embeds[0];
        
        const modal = new ModalBuilder()
            .setCustomId(`embed_edit_modal_${messageId}_${channel.id}`)
            .setTitle('Edit Embed');
        
        // Add title input
        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title')
            .setLabel('Embed Title')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter a title for your embed')
            .setRequired(false)
            .setMaxLength(256)
            .setValue(embed.title || '');
        
        // Add description input
        const descriptionInput = new TextInputBuilder()
            .setCustomId('embed_description')
            .setLabel('Embed Description')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Enter a description for your embed')
            .setRequired(false)
            .setMaxLength(4000)
            .setValue(embed.description || '');
        
        // Add color input
        const colorInput = new TextInputBuilder()
            .setCustomId('embed_color')
            .setLabel('Embed Color (hex code)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('#3498db')
            .setRequired(false)
            .setMaxLength(7)
            .setValue(embed.hexColor || '#3498db');
        
        // Add footer input
        const footerInput = new TextInputBuilder()
            .setCustomId('embed_footer')
            .setLabel('Embed Footer')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter text for the footer')
            .setRequired(false)
            .setMaxLength(2048)
            .setValue(embed.footer?.text || '');
        
        // Add image URL input
        const imageInput = new TextInputBuilder()
            .setCustomId('embed_image')
            .setLabel('Image URL (optional)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('https://example.com/image.png')
            .setRequired(false)
            .setValue(embed.image?.url || '');
        
        // Create action rows
        const titleRow = new ActionRowBuilder().addComponents(titleInput);
        const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput);
        const colorRow = new ActionRowBuilder().addComponents(colorInput);
        const footerRow = new ActionRowBuilder().addComponents(footerInput);
        const imageRow = new ActionRowBuilder().addComponents(imageInput);
        
        // Add inputs to the modal
        modal.addComponents(titleRow, descriptionRow, colorRow, footerRow, imageRow);
        
        // Show the modal
        await interaction.showModal(modal);
    } catch (error) {
        console.error('Error editing embed:', error);
        
        await interaction.reply({
            content: 'حدث خطأ أثناء تعديل المضمن.',
            ephemeral: true
        });
    }
}

// Handle template embeds
async function handleTemplateEmbed(interaction, client) {
    const templateType = interaction.options.getString('type');
    
    // Create embed based on template type
    let embed = new EmbedBuilder();
    
    switch (templateType) {
        case 'announcement':
            embed
                .setColor('#e74c3c')
                .setTitle('📢 انطلاقة مهمة')
                .setDescription('لدينا أخبار مثيرة لكل من يريد المعرفة بها! قراءة كل شيء أدناه.')
                .addFields(
                    { name: 'ما جديد', value: 'أدخل إعلانك هنا...' },
                    { name: 'أوقات', value: 'معلومات التاريخ والوقت...' },
                    { name: 'معلومات إضافية', value: 'أي تفاصيل أخرى مهمة...' }
                )
                .setFooter({ text: 'تعديل هذا القالب بمحتواك الخاص', iconURL: client.user.displayAvatarURL() });
            break;
            
        case 'welcome':
            embed
                .setColor('#2ecc71')
                .setTitle('👋 أهلاً بك في الخادم!')
                .setDescription('نحن سعداء بوجودك هنا! تحقق من المعلومات أدناه للبدء.')
                .addFields(
                    { name: 'قواعد', value: 'تأكد من قراءة قواعدنا في <#CHANNEL_ID>' },
                    { name: 'الأدوار', value: 'احصل على الأدوار في <#CHANNEL_ID>' },
                    { name: 'التقديم', value: 'أقدم نفسك في <#CHANNEL_ID>' }
                )
                .setImage('https://i.imgur.com/GGKye05.png')
                .setFooter({ text: 'تعديل هذا القالب بمحتواك الخاص', iconURL: client.user.displayAvatarURL() });
            break;
            
        case 'rules':
            embed
                .setColor('#3498db')
                .setTitle('📜 قواعد الخادم')
                .setDescription('يرجى متابعة هذه القواعد لضمان تجربة موجبة للجميع.')
                .addFields(
                    { name: '1. كون حذراً', value: 'اعترف بالآخرين بالاحترام. التحرش والكلام العنيد والتمييز غير مسموح به.' },
                    { name: '2. عدم التسرب', value: 'تجنب التسريب في الرسائل، الأيموتات، أو الإشارات.' },
                    { name: '3. الحفاظ على المحتوى المناسب', value: 'لا يجوز المحتوى المضغوط في القنوات غير المضغوطة.' },
                    { name: '4. موافقة على شروط ديسكورد', value: 'الالتزام بشروط خدمة ديسكورد والمواد الموجهة.' },
                    { name: '5. اتباع المشرفين', value: 'اتباع التوجيهات من المشرفين والمديرين.' }
                )
                .setFooter({ text: 'تعديل هذا القالب بمحتواك الخاص', iconURL: client.user.displayAvatarURL() });
            break;
            
        case 'info':
            embed
                .setColor('#9b59b6')
                .setTitle('ℹ️ معلومات الخادم')
                .setDescription('كل ما تحتاجه لمعرفة الخادم.')
                .addFields(
                    { name: 'عنا', value: 'معلومات عن الخادم وغرضه...' },
                    { name: 'القنوات', value: 'وصف القنوات المهمة...' },
                    { name: 'الأدوار', value: 'معلومات عن نظام الأدوار...' },
                    { name: 'الأوامر', value: 'قائمة الأوامر المفيدة للبوت...' }
                )
                .setFooter({ text: 'تعديل هذا القالب بمحتواك الخاص', iconURL: client.user.displayAvatarURL() });
            break;
            
        case 'poll':
            embed
                .setColor('#f1c40f')
                .setTitle('📊 استطلاع: [سؤالك هنا]')
                .setDescription('قم بالتصويت بالرد على هذه الرسالة!')
                .addFields(
                    { name: 'خيار 1️⃣', value: 'وصف خيار 1...' },
                    { name: 'خيار 2️⃣', value: 'وصف خيار 2...' },
                    { name: 'خيار 3️⃣', value: 'وصف خيار 3...' }
                )
                .setFooter({ text: 'ينتهي الاستطلاع: [التاريخ/الوقت] • تعديل هذا القالب بمحتواك الخاص', iconURL: client.user.displayAvatarURL() });
            break;
    }
    
    // Create preview for the user
    await interaction.reply({
        content: 'هذا هو المضمن القالب الخاص بك. يمكنك إرساله كما هو أو تخصيصه.',
        embeds: [embed],
        ephemeral: true
    });
    
    // Add buttons to edit or send the embed
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`embed_template_edit_${templateType}`)
                .setLabel('تعديل القالب')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`embed_template_send`)
                .setLabel('إرسال إلى القناة')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`embed_template_cancel`)
                .setLabel('إلغاء')
                .setStyle(ButtonStyle.Secondary)
        );
    
    await interaction.followUp({
        components: [row],
        ephemeral: true
    });
} 