const Discord = require("discord.js");
const UserModel = require('../models/User')
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        if(!args.length) return message.reply('You didn\'t provide a HEX code!');

        const hex = args[0];
        if(args[1]) return message.reply('Please put the hex code in the first Argument');
        const req = await UserModel.findOne({ id: message.member.id })
        
        var re = /[0-9A-Fa-f]{6}/g;
        var hexInput = hex;

        if(re.test(hexInput)) {
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id }, { hex: hexInput }, {new: true});
            return message.reply(`profile updated!\n` + config.siteUrl + '/user/' + message.member.id);
        } else {
            return message.reply('You didn\'t provide a valid HEX code!');
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
    name: "setcolor",
    aliases: []
}