const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

const OPENAI_API = process.env.OPENAI_API;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Envoie un message à ChatGPT et reçois une réponse.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Le message à envoyer à ChatGPT.')
                .setRequired(true)),
                async execute(interaction) {
                    await interaction.deferReply();
                
                    const message = interaction.options.getString('message');
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${OPENAI_API}`
                        },
                        body: JSON.stringify({
                            model: "gpt-3.5-turbo",
                            messages: [{ role: "user", content: message }]
                        })
                    });
                
                    const responseData = await response.json();
                
                    if (response.ok && responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message && responseData.choices[0].message.content) {
                        await interaction.editReply({ content: responseData.choices[0].message.content });
                    } else {
                        await interaction.editReply({ content: "Désolé, je n'ai pas pu obtenir de réponse de ChatGPT." });
                    }
                },             
};
