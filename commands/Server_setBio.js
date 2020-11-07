const Discord = require("discord.js");
const UserModel = require('../models/GuildUsers')
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        if(!args.length) return message.reply('You didn\'t provide a bio.');
        if(args.length > 500) return message.reply('Error, You can\'t have more than `500` characters.');

        const bio1 = args.join(" ");
        function nl2br(str){
            return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
        }
        const bio2 = bio1.replace(/<[^>]+>/g, '');
        const bio = nl2br(bio2);
        const req = await UserModel.findOne({ id: message.member.id, guildID: message.guild.id })
        if(!req){
            const doc = new UserModel({ id: message.member.id, guildID: message.guild.id, bio: bio })
            await doc.save();
        }
        if(req.bio == 'null'){
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id, guildID: message.guild.id }, { bio: bio }, {new: true})
        } else {
            const doc = await UserModel.findOneAndUpdate({ id: message.member.id, guildID: message.guild.id }, { bio: bio }, {new: true});
        } 
        return message.reply(`profile updated!\n` + config.siteUrl + '/s/' + message.guild.id + '/u/' + message.member.id);
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
    name: "serverbio",
    aliases: []
}