const Discord = require("discord.js");
const config = require("../config.json");
const colors = require("../colors.json")
const GuildModel = require("../models/Guild");
const UserModel = require("../models/User")
module.exports.run = async (bot, message, args) => {
    try {
        const author = await UserModel.findOne({ id: message.author.id });
        const guildData = await GuildModel.findOne({ id: message.guild.id })
        const state = args[0];
        if(!state) return message.channel.send("Please use the command like this: `"+ guildData.prefix +"userdata (keep/clear)`")

        if(state == "keep") {
            if(author.dataCleared == false) return message.reply("Yikes! I can't do this, you are already keeping the data!");
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id}, { $set: { dataCleared: false }}, { new: true });
            message.channel.send("Your data was kept!");
            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**dataCleared**')
            .setColor(colors.success)
            .setTimestamp()
            .addFields(
                { name: '**User**', value: `${doc.username} - ${message.member.id}`, inline: true },
                { name: '**Guild**', value: `${message.guild.name} - ${message.guild.id}`, inline: true },
                { name: '**Data Removed**', value: `False`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(log.channelLogId).send(removeEmbed);
        } else if(state == "clear") {
            if(author.dataCleared == true) return message.reply("Yikes! I can't do this, you are already clearing the data!");
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id}, { $set: { dataCleared: true }}, { new: true });
            message.channel.send("Your data was cleared!");
            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**dataCleared**')
            .setColor(colors.danger)
            .setTimestamp()
            .addFields(
                { name: '**User**', value: `${doc.username} - ${message.member.id}`, inline: true },
                { name: '**Guild**', value: `${message.guild.name} - ${message.guild.id}`, inline: true },
                { name: '**Data Removed**', value: `true`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(log.channelLogId).send(removeEmbed);
        } else {
            return message.channel.send("Please use the command like this: `"+ guildData.prefix +"userdata (keep/clear)`")
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
    name: "userdata",
    aliases: []
}