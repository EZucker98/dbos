const Discord = require("discord.js");
const config = require("../config.json");
const colors = require("../colors.json")
const GuildModel = require("../models/Guild");
const UserModel = require("../models/User")
module.exports.run = async (bot, message, args) => {
    try {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply("Missing the following perms: `MANAGE_GUILD`");
        const author = await UserModel.findOne({ id: message.author.id });
        const guildData = await GuildModel.findOne({ id: message.guild.id })
        const state = args[0];
        if(!state) return message.channel.send("Please use the command like this: `"+ guildData.prefix +"listserver (true/false)`")

        if(state == "true") {
            if(guildData.listed == "true") return message.reply("Yikes! The server is already listed!");
            if(guildData.listed == "featured") return message.reply("Yikes! The server is featured on the listing!");
            let dinvite = await message.channel.createInvite({
                maxAge: 0,
                maxUses: 0
              }).catch(console.error);
            const doc = await GuildModel.findOneAndUpdate({ id: message.guild.id }, { $set: { listed: "true", invite: dinvite }}, { new: true });
            return message.channel.send("Server Listed! Invite: `" + dinvite + "`");
        } else if(state == "false") {
            if(guildData.listed == "false") return message.reply("Yikes! The server is already unlisted!");
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id}, { $set: { listed: "false" }}, { new: true });
            message.channel.send("Server unlisted \n" + config.siteUrl + "/g/" + message.guild.id + "/info");
        } else {
            return message.channel.send("Please use the command like this: `"+ guildData.prefix +"listserver (true/false)`")
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
    name: "serverlist",
    aliases: []
}