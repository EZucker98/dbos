const Discord = require("discord.js");
const config = require('../config.json');
const color = require('../colors.json');

module.exports.run = async (bot, message, args) => {
    try {
        const Embed = new Discord.MessageEmbed();
            Embed.setColor(color.success);
            Embed.setTitle('**Server Info**')
            Embed.setURL(config.siteUrl)
            Embed.addFields(
                { name: '**Server Name**', value: `${message.guild.name}`, inline: true },
                { name: '**Users**', value: `${message.guild.memberCount}`, inline: true },
                { name: '**Page**', value: `${config.siteUrl}/s/${message.guild.id}`, inline: true },
            )
        message.channel.send(Embed);
    } catch (error) {
        const c = require("../colors.json");
        const Err_1 = new Discord.MessageEmbed()
            .setColor(c.error)
            .setTitle("**Error**")
            .setDescription("I have encountered a unexpected error: `"+ error.message +"`\nplease report this to: https://dbos.flarum.cloud or https://github.com/wezacon/dbos")
        return message.channel.send(Err_1);
    }

}

module.exports.help = {
    name: "server",
    aliases: ["si"]
}