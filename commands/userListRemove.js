const Discord = require("discord.js");
const UserModel = require('../models/User')
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        if(!message.guild.id == config.bot.moderation.server.id) return;
            if(!message.member.roles.cache.has(config.bot.moderation.server.moderatorRoleId)) return;
            const Target = args[0];

            if(Target == config.bot.id) return message.channel.send("Please insert a valid user ID");
            const RXR = args.slice(1).join(' ');
            function nl2br(str){
                return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
            }
            const RSX = RXR.replace(/<[^>]+>/g, '');
            const Reason = nl2br(RSX);
            if(Target === message.member.id) return message.reply('I can\'t remove you.');

            if(!Target) return message.reply('Please enter in a valid user id');

            if(!Target.length > 5) return message.reply('Please enter in a valid user id');

            if(!RXR.length > 10) returnmessage.reply('Please add a reason to remove this user.');

            const req = await UserModel.findOne({ id: Target })
            if(!req){
                const doc = new UserModel({ id: Target })
                await doc.save();
            }


            if(req.removed == null || req.removed == undefined){
                const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { removed: true, removeReason:  Reason }}, { new: true })
                message.reply(`I've succesfully removed: \`${doc.id}\` Reason: \`${RSX}\` `);
                bot.users.cache.get(Target).send("Your profile has been removed from the profile listing, Reason: `"+ RSX +"`\nProfile: " + config.siteUrl + "/user/" + doc.id);
                const log = config.bot.moderation.entryLogging;
                const colors = require("../colors.json");
                const removeEmbed = new Discord.MessageEmbed()
                .setTitle('**Removed User**')
                .setColor(colors.danger)
                .setDescription(config.siteName + " has removed a user from the listing.")
                .setTimestamp()
                .addFields(
                    { name: '**Moderator**', value: `${message.member.user.tag}`, inline: true },
                    { name: '**Reason**', value: `${RXR}`, inline: true },
                    { name: '**Removed User**', value: `${req.username} - ${Target}`, inline: true }
                )
                .setFooter('© Wezacon.com')
                bot.channels.cache.get(log.channelLogId).send(removeEmbed);
            } else {
                const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { removed: true, removeReason:  Reason }}, { new: true })
                message.reply(`I've succesfully removed: \`${doc.id}\` Reason: \`${RSX}\` `);
                bot.users.cache.get(Target).send("Your profile has been removed from the profile listing, Reason: `"+ RSX +"`\nProfile: " + config.siteUrl + "/user/" + doc.id);
                const log = config.bot.moderation.entryLogging;
                const colors = require("../colors.json");
                const removeEmbed = new Discord.MessageEmbed()
                .setTitle('**Removed User**')
                .setColor(colors.danger)
                .setDescription(config.siteName + " has removed a user from the listing.")
                .setTimestamp()
                .addFields(
                    { name: '**Moderator**', value: `${message.member.user.tag}`, inline: true },
                    { name: '**Reason**', value: `${RXR}`, inline: true },
                    { name: '**Removed User**', value: `${req.username} - ${Target}`, inline: true }
                )
                .setFooter('© Wezacon.com')
                bot.channels.cache.get(log.channelLogId).send(removeEmbed);
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
    name: "listremove",
    aliases: []
}