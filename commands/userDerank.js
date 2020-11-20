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
        if(!Rank) return message.channel.send("Please use the command like this: `"+ guildData.prefix +"setuser (userid) (rank)`\nAvailable ranks: `bugbuster, admin, moderator, contributor, verified`")

        const TargetData = await UserModel.findOne({ id: Target });
        if(!TargetData) return message.channel.send("User not found.");
        if(Rank == "moderator") {
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { moderator: false }}, { new: true });
            message.channel.send("Updated user, they are now not a moderator!");

            // bot.users.cache.get(Target).send("Your moderator role has been removed.");

            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**Demoted User**')
            .setColor(colors.danger)
            .setDescription(config.siteName + " has Demoted a user on the listing.")
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Demoted**', value: `${doc.username} - ${Target}`, inline: true },
                { name: '**Taken rank**', value: `moderator`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(config.bot.moderation.entryLogging.channelLogId).send(removeEmbed);
            } else if(Rank == "contributor") {
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { contributor: false }}, { new: true });
            message.channel.send("Updated user, they are now not a contributor!");

            // bot.users.cache.get(Target).send("Your contributor role has been removed.");

            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**Demoted User**')
            .setColor(colors.danger)
            .setDescription(config.siteName + " has Demoted a user on the listing.")
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Demoted**', value: `${doc.username} - ${Target}`, inline: true },
                { name: '**Taken rank**', value: `contributor`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(config.bot.moderation.entryLogging.channelLogId).send(removeEmbed);
        } else if(Rank == "verified") {
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { verified: false }}, { new: true });
            message.channel.send("Updated user, they are now unverified!");

            // bot.users.cache.get(Target).send("You have been unverified on the profile listing!");
            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const deRank = new Discord.MessageEmbed()
            .setTitle('**Demoted User**')
            .setColor(colors.danger)
            .setDescription(config.siteName + " has Demoted a user on the listing.")
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Demoted**', value: `${doc.username} - ${Target}`, inline: true },
                { name: '**Taken rank**', value: `verified`, inline: true }
            )
            .setFooter('© Wezacon.com')
            bot.channels.cache.get(config.bot.moderation.entryLogging.channelLogId).send(deRank);
        } else if(Rank == "admin") {
            if(!message.member.roles.cache.has(config.bot.moderation.server.superAdminRoleId)) return message.reply("You are not a super admin.");
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { admin: false }}, { new: true });
            message.channel.send("Updated user, they are now not an admin!");

            // bot.users.cache.get(Target).send("Your admin role has been removed.");

            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const Rankde = new Discord.MessageEmbed()
            .setTitle('**Demoted User**')
            .setColor(colors.danger)
            .setDescription(config.siteName + " has Demoted a user on the listing.")
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Demoted**', value: `${doc.username} - ${Target}`, inline: true },
                { name: '**Taken rank**', value: `Admin`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(config.bot.moderation.entryLogging.channelLogId).send(Rankde);
        } else if(Rank == "bugbuster") {
            if(!message.member.roles.cache.has(config.bot.moderation.server.superAdminRoleId)) return message.reply("You are not a super admin.");
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { bugBuster: false }}, { new: true });
            message.channel.send("Updated user, they are now not an Bug Buster!");

            // bot.users.cache.get(Target).send("Your admin role has been removed.");

            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const Rankde = new Discord.MessageEmbed()
            .setTitle('**Demoted User**')
            .setColor(colors.danger)
            .setDescription(config.siteName + " has Demoted a user on the listing.")
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Demoted**', value: `${doc.username} - ${Target}`, inline: true },
                { name: '**Taken rank**', value: `Bug Buster`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(config.bot.moderation.entryLogging.channelLogId).send(Rankde);
        } else if(Rank == "partner") {
            if(!message.member.roles.cache.has(config.bot.moderation.server.superAdminRoleId)) return message.reply("You are not a super admin.");
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { partner: false }}, { new: true });
            message.channel.send("Updated user, they are now not an partner!");

            // bot.users.cache.get(Target).send("Your admin role has been removed.");

            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const Rankde = new Discord.MessageEmbed()
            .setTitle('**Demoted User**')
            .setColor(colors.danger)
            .setDescription(config.siteName + " has Demoted a user on the listing.")
            .setTimestamp()
            .addFields(
                { name: '**Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Demoted**', value: `${doc.username} - ${Target}`, inline: true },
                { name: '**Taken rank**', value: `partner`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(config.bot.moderation.entryLogging.channelLogId).send(Rankde);
        }
    } catch (error) {
        const c = require("../colors.json");
        const Err_1 = new Discord.MessageEmbed()
            .setColor(c.error)
            .setTitle("**Error**")
            .setDescription("I have encountered a unexpected error: `"+ error.message + "`\nplease report this to: https://dbos.flarum.cloud or https://github.com/wezacon/dbos")
        return message.channel.send(Err_1);
    }
}

module.exports.help = {
    name: "unsetuser",
    aliases: []
}