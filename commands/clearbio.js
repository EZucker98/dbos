const Discord = require("discord.js");
const UserModel = require('../models/User')
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        if(!message.guild.id == config.bot.moderation.server.id) return;
        if(!message.member.roles.cache.has(config.bot.moderation.server.adminRoleId)) return;
        const Target = args[0]
        console.log(Target.length + " <- TEST")
        if(!Target) return message.reply('You didn\'t provide a user id!');
        if(!args[1]) return message.reply('You didn\'t provide a reason!');
        const reasoning = args.slice(1).join(' ');
        if(reasoning.length > 100) return message.reply('Error, You can\'t have more than `100` words.');
        


        function nl2br(str){
            return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
        }
        const RSCRIPTLESS = reasoning.replace(/<[^>]+>/g, '');
        const bio = nl2br(RSCRIPTLESS);
        const req = await UserModel.findOne({ id: Target })
        if(!req) return message.reply("This user was not found in the database.");
        if(req.bio == 'null'){
            const doc = await UserModel.findOneAndUpdate({ id: Target }, { bio: bio }, {new: true})
        } else {
            const doc = await UserModel.findOneAndUpdate({ id: Target }, { bio: bio }, {new: true});
        } 
        message.reply(`Target profile updated!\nTheir bio was removed and replaced with: \`${RSCRIPTLESS}\`\n` + config.siteUrl + '/user/' + Target);
    
        const log = config.bot.moderation.entryLogging;
            const colors = require("../colors.json");
            const removeEmbed = new Discord.MessageEmbed()
            .setTitle('**Bio forcefully changed**')
            .setColor(colors.danger)
            .setDescription(config.siteName + " has forcefully changed a user's bio.")
            .setTimestamp()
            .addFields(
                { name: '**User**', value: `${req.username}`, inline: true },
                { name: '**ADMIN**', value: `${message.member.user.tag}`, inline: true },
                { name: '**User page**', value: `${config.siteUrl}/user/${req.id}`, inline: true },
                { name: '**New bio**', value: `${reasoning}`, inline: true }
            )
            .setFooter('© Wezacon.com')
           return bot.channels.cache.get(log.channelLogId).send(removeEmbed);
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
    name: "clearbio",
    aliases: []
}