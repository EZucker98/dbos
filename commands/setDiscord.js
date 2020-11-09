const Discord = require("discord.js");
const UserModel = require('../models/User')
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        if(!args.length) return message.reply('You didn\'t provide a server invite, example `https://discord.gg/83nXAu4nSG`');
        if(!message.content.includes("https://discord.gg/")) return message.reply('Please provide a valid discord url, example `https://discord.gg/83nXAu4nSG`');

        const discordServer = args[0];
        if(args[1]) return message.reply("You didn\'t provide a server invite, example `https://discord.gg/83nXAu4nSG`")
        const req = await UserModel.findOne({ id: message.member.id })
        if(!req){
            const doc = new UserModel({ id: message.member.id, discordServer: discordServer })
            await doc.save();
        }
        if(req.discordServer == 'null'){
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id }, { discordServer: discordServer }, {new: true})
        } else {
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id }, { discordServer: discordServer }, {new: true});
        } 
        return message.reply(`profile updated!\n` + config.siteUrl + '/user/' + message.member.id);
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
    name: "discordurl",
    aliases: []
}