const Discord = require("discord.js");
const config = require("../config.json");
const colors = require("../colors.json")
const GuildModel = require("../models/Guild");
const UserModel = require("../models/User")
module.exports.run = async (bot, message, args) => {
    try {
        const guildData = await GuildModel.findOne({ id: message.guild.id })
        const state = args[0];
        if(!state) return message.channel.send("Please use the command like this: `"+ guildData.prefix +"notifications (allow/disable)`")

        if(state == "allow") {
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id}, { $set: { notifications: true }}, { new: true });
            message.channel.send("You will now receive notifications for example: leveling up");
            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**Notifications enabled**')
            .setColor(colors.success)
            .setTimestamp()
            .addFields(
                { name: '**User**', value: `${doc.username} - ${message.member.id}`, inline: true },
                { name: '**Guild**', value: `${message.guild.name} - ${message.guild.id}`, inline: true },
                { name: '**Notifications**', value: `true`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(log.channelLogId).send(removeEmbed);
        } else if(state == "disable") {
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id}, { $set: { notifications: false }}, { new: true });
            message.channel.send("You will now not receive notifications for example: leveling up");
            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**Notifications disabled**')
            .setColor(colors.danger)
            .setTimestamp()
            .addFields(
                { name: '**User**', value: `${doc.username} - ${message.member.id}`, inline: true },
                { name: '**Guild**', value: `${message.guild.name} - ${message.guild.id}`, inline: true },
                { name: '**Notifications**', value: `false`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(log.channelLogId).send(removeEmbed);
        } else {
            return message.channel.send("Please use the command like this: `"+ guildData.prefix +"notifications (allow/disable)`")
        }
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
    name: "notifications",
    aliases: []
}