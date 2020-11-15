const Discord = require("discord.js");
const GuildModel = require('../models/Guild')
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        if(!message.member.hasPermission('MANAGE_SERVER')) return message.reply("Missing the following perms: `MANAGE_SERVER`");
        if(!args.length) return message.reply('You didn\'t provide a server description.');
        if(args.length > 100) return message.reply('Error, You can\'t have more than `100` words.');

        const desc1 = args.join(" ");
        function nl2br(str){
            return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
        }
        const desc = desc1.replace(/<[^>]+>/g, '');
        const listedDescription = nl2br(desc);
        const req = await GuildModel.findOne({ id: message.guild.id })
        if(!req){
            const doc = new GuildModel({ id: message.guild.id, listedDescription: listedDescription })
            await doc.save();
        }
        if(req.listedDescription == 'null'){
            const doc = await GuildModel.findOneAndUpdate({ id: message.guild.id }, { listedDescription: listedDescription }, {new: true})
        } else {
            const doc = await GuildModel.findOneAndUpdate({ id: message.guild.id }, { listedDescription: listedDescription }, {new: true});
        } 
        return message.reply(`Server updated!\n` + config.siteUrl + '/g/' + message.guild.id + '/info');
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
    name: "serverdescription",
    aliases: []
}