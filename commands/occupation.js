const Discord = require("discord.js");
const UserModel = require('../models/User')
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        if(!args.length) return message.reply('You didn\'t provide a occupation.');
        if(args.length > 10) return message.reply('Error, You can\'t have more than `10` words.');

        const occ = args.join(" ");
        function nl2br(str){
            return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
        }
        const occu = occ.replace(/<[^>]+>/g, '');
        const occupation = nl2br(occu);
        const req = await UserModel.findOne({ id: message.member.id })
        if(!req){
            const doc = new UserModel({ id: message.member.id, occupation: occupation })
            await doc.save();
        }
        if(req.occupation == 'null'){
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id }, { occupation: occupation }, {new: true})
        } else {
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id }, { occupation: occupation }, {new: true});
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
    name: "occupation",
    aliases: []
}