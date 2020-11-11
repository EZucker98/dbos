const Discord = require("discord.js");
const config = require("../config.json");
 const color = require("../colors.json");
module.exports.run = async (bot, message, args) => {
    try {
        const GuildModel = require("../models/Guild");
        const guild = await GuildModel.findOne({ id: message.guild.id });
        if(guild.premium == false) return message.reply("The server needs premium to use this command!")
        const Auth = message.author.id;
        const embed = new Discord.MessageEmbed()
            .setColor(color.premium)
            .setTitle("**Server profile**")
            .setDescription('Here\'s your profile: ' + config.siteUrl + '/s/' + message.guild.id + '/u/' + Auth)
        return message.channel.send(embed);
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
    name: "serverpage",
    aliases: []
}