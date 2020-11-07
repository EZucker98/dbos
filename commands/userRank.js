const Discord = require("discord.js");
const config = require("../config.json");
const colors = require("../colors.json")
const GuildModel = require("../models/Guild");
const UserModel = require("../models/User")
module.exports.run = async (bot, message, args) => {
    try {
        const guildData = await GuildModel.findOne({ id: message.guild.id })
        if(!message.guild.id == config.bot.moderation.server.id) return;
        if(!message.member.roles.cache.has(config.bot.moderation.server.adminRoleId)) return;
        const Target = args[0];
        const Rank = args[1];
    
        if(!Target) return message.channel.send("Please insert a valid user ID")
        if(Target == config.bot.id) return message.channel.send("Please insert a valid user ID");
        if(!Rank) return message.channel.send("Please use the command like this: `"+ guildData.prefix +"setuser (userid) (rank)`\nAvailable ranks: `admin, contributor, verified`")

        const TargetData = await UserModel.findOne({ id: Target });
        if(!TargetData) return message.channel.send("User not found.");

        if(Rank == "contributor") {
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { contributor: true }}, { new: true });
            message.channel.send("Updated user, they are now a contributor!");
            // bot.users.cache.get(Target).send("You have been given the contributor role!");
            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const bedre = new Discord.MessageEmbed()
            .setTitle('**Promoted User**')
            .setColor(colors.success)
            .setDescription(config.siteName + " has Promoted a user on the listing.")
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Promoted**', value: `${doc.username} - ${Target}`, inline: true },
                { name: '**Added rank**', value: `contributor`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(config.bot.moderation.entryLogging.channelLogId).send(bedre);
        } else if(Rank == "verified") {
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { verified: true }}, { new: true });
            message.channel.send("Updated user, they are now verified!");
            // bot.users.cache.get(Target).send("You have been given the verified badge!");
            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const emrev = new Discord.MessageEmbed()
            .setTitle('**Promoted User**')
            .setColor(colors.success)
            .setDescription(config.siteName + " has Promoted a user on the listing.")
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Promoted**', value: `${doc.username} - ${Target}`, inline: true },
                { name: '**Added rank**', value: `verified`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(config.bot.moderation.entryLogging.channelLogId).send(emrev);
        } else if(Rank == "admin") {
             if(!message.member.roles.cache.has(config.bot.moderation.server.superAdminRoleId)) return message.reply("You are not a super admin.");
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { admin: true }}, { new: true });
            message.channel.send("Updated user, they are now a admin!");
            // bot.users.cache.get(Target).send("You have been given the admin role!");
            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**Promoted User**')
            .setColor(colors.success)
            .setDescription(config.siteName + " has Promoted a user on the listing.")
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Promoted**', value: `${doc.username} - ${Target}`, inline: true },
                { name: '**Added rank**', value: `admin`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(config.bot.moderation.entryLogging.channelLogId).send(removeEmbed);
        }
    } catch (error) {
        console.log(error)
        const c = require("../colors.json");
        const Err_1 = new Discord.MessageEmbed()
            .setColor(c.error)
            .setTitle("**Error**")
            .setDescription("I have encountered a unexpected error: `"+ error.message +"`\nplease report this to: https://dbos.flarum.cloud or https://github.com/wezacon/dbos")
        return message.channel.send(Err_1);
    }
}

module.exports.help = {
    name: "setuser",
    aliases: []
}