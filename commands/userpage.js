const Discord = require("discord.js");
const Levels = require('discord-xp');
const levels = require("../models/Levels");
const c = require("../colors.json");
const config = require("../config.json");
const Gm = require("../models/Guild");
module.exports.run = async (bot, message, args) => {
    try {
        const GMF = await Gm.findOne({ id: message.guild.id });
        if(GMF.premium == false) return;
            const embed = new Discord.MessageEmbed()
                .setColor(c.premium)
                .setTitle("**Server users**")
                .setDescription(config.siteUrl + "/s/" + message.guild.id + '/users')
            message.channel.send(embed)

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
    name: "serverusers",
    aliases: []
}