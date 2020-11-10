const Discord = require("discord.js");
const UserModel = require('../models/User');
const GuildModel = require('../models/Guild');
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You are lacking the following permissions: `ADMINISTRATOR`")
        const Guild = await GuildModel.findOne({ id: message.guild.id })
        if(!args[0]) return message.reply("Please use the command like this: `"+ Guild.prefix +"log (channelid) (true/false)`");
        const logChannel = args[0];
        if(!bot.channels.cache.get(logChannel)) return message.reply("Log channel not found!");
        const state = args[1];

        if(state == "true"){
            const req = await GuildModel.findOne({ id: message.guild.id })
            if(!req){
                const doc = new GuildModel({ id: message.guild.id, logChannel: logChannel })
                await doc.save();
            }
            if(req.logChannel == 'null'){
                const doc = await GuildModel.findOneAndUpdate({ id: message.guild.id }, { logChannel: "none" }, {new: true})
            } else {
                const doc = await GuildModel.findOneAndUpdate({ id: message.guild.id }, { logChannel: "none" }, {new: true});
            } 
            return message.reply(`Log channel set! The channel will now receive logs!`);
        } else if(state == "false"){
            const req = await GuildModel.findOne({ id: message.guild.id })
            if(!req){
                const doc = new GuildModel({ id: message.guild.id, logChannel: "none" })
                await doc.save();
            }
            if(req.logChannel == 'null'){
                const doc = await GuildModel.findOneAndUpdate({ id: message.guild.id }, { logChannel: "none" }, {new: true})
            } else {
                const doc = await GuildModel.findOneAndUpdate({ id: message.guild.id }, { logChannel: "none" }, {new: true});
            } 
            return message.reply(`Log channel unset! The channel will now not receive logs!`);
        } else {
            return message.reply("Please use the command like this: `"+ Guild.prefix +"log (channelid) (true/false)`");
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
    name: "log",
    aliases: []
}