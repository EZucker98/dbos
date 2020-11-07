const Discord = require("discord.js");
const config = require("../config.json");
const GuildModel = require("../models/Guild");
module.exports.run = async (bot, message, args) => {
    try {
        const guild = GuildModel.findOne({ id: message.guild.id })
        if(guild.premium == false) return message.reply("The server needs premium to use this command!")
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You are lacking the following permissions: `ADMINISTRATOR`");

        const status = args[0];

        if(!status) return message.reply("Please use the command like this: `"+ guild.prefix +"serverinvite (show/hide)`\nShow = Create a new invite link and show a server invite on the server page\nHide = Delete the invite and don't show the button")
        
        if(status == "show"){
            let dinvite = await message.channel.createInvite({
                maxAge: 0,
                maxUses: 0
              }).catch(console.error);

            const req = await GuildModel.findOneAndUpdate({ id: message.guild.id }, { $set: { invite: dinvite } }, { new: true })

            message.reply("The server invite has been set to `"+ dinvite +"` on: " + config.siteUrl + "/s/" + message.guild.id)

            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**Server Invite Shown**')
            .setColor(colors.premium)
            .setDescription(config.siteName + " has Shown a server invite.")
            .setTimestamp()
            .addFields(
                { name: '**Server Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Server Invite Shown**', value: `${message.guild.name} - ${message.guild.id}`, inline: true },
                { name: '**Invite Link**', value: `${dinvite}`, inline: true }
            )
            .setFooter('© Wezacon.com')
            bot.channels.cache.get(log.channelLogId).send(removeEmbed);
        } else if(status == "hide"){
            const req = await GuildModel.findOneAndUpdate({ id: message.guild.id }, { $set: { invite: "none" } }, { new: true })

            message.reply("The server invite has been set to `none` on: " + config.siteUrl + "/s/" + message.guild.id)


            const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**Server Invite Hiden**')
            .setColor(colors.danger)
            .setDescription(config.siteName + " has hiden a server invite.")
            .setTimestamp()
            .addFields(
                { name: '**Server Admin**', value: `${message.member.user.tag}`, inline: true },
                { name: '**Server Invite Hiden**', value: `${message.guild.name} - ${message.guild.id}`, inline: true }
            )
            .setFooter('© Wezacon.com')
            bot.channels.cache.get(log.channelLogId).send(removeEmbed);
        } else {
            return message.reply("Please use the command like this: `"+ guild.prefix +"serverinvite (show/hide)`\nShow = Create a new invite link and show a server invite on the server page\nHide = Delete the invite and don't show the button")
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
    name: "serverinvite",
    aliases: []
}