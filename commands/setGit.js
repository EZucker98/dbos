const Discord = require("discord.js");
const UserModel = require('../models/User')
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        if(!args.length) return message.reply('You didn\'t provide a github url, example `https://github.com/wezacon`');
        if(!message.content.includes("https://github.com/")) return message.reply('Please provide a valid github url, example `https://github.com/wezacon`');

        const github = args[0];
        if(args[1]) return message.reply('You didn\'t provide a github url, example `https://github.com/wezacon`');
        const req = await UserModel.findOne({ id: message.member.id })
        if(!req){
            const doc = new UserModel({ id: message.member.id, github: github })
            await doc.save();
        }
        if(req.github == 'null'){
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id }, { github: github }, {new: true})
        } else {
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id }, { github: github }, {new: true});
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
    name: "giturl",
    aliases: []
}