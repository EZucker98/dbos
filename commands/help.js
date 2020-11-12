const Discord = require("discord.js");
const colors = require('../colors.json');
const GuildModel = require('../models/Guild')
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        const req = await GuildModel.findOne({ id: message.guild.id })
            if(!req){
                const doc = new GuildModel({ id: message.guild.id })
                await doc.save();
            }
            if(req.prefix == 'null'){
                var prefix = config.bot.prefix;
            } else {
                var prefix = req.prefix;
            }
            const helpEmbed = new Discord.MessageEmbed();
                    helpEmbed.setColor(colors.info)
                    helpEmbed.setTitle('**Help**')
                    helpEmbed.setURL(config.siteUrl)
                    helpEmbed.setDescription('The simple yet powerful open source discord bot!')
                    helpEmbed.setThumbnail(config.iconUrl)
                    helpEmbed.addFields(
                        { name: '**Fun**', value: `${prefix}ping\n${prefix}prefix\n${prefix}server\n${prefix}rank\n${prefix}leaderboard`, inline: false },
                        { name: '**Profile**', value: `${prefix}bio - set your bio for your profile\n${prefix}discordurl - set your server url for your profile\n${prefix}giturl - set your github url for your profile\n${prefix}occupation - Set your occupation\n\n${prefix}page - view your profile\n${prefix}liststatus - Pick the visibility of your profile\n${prefix}userdata - Remove your data from the *global* listing`, inline: false },
                        { name: '**Admin**', value: `${prefix}setprefix\n${prefix}resetprefix\n${prefix}kick\n${prefix}ban\n${prefix}clear\n${prefix}poll - This will send a poll to the same channel`, inline: false },
                    )
                    if(req.premium == true){
                        helpEmbed.addFields(
                            { name: '**Premium**', value: `${prefix}serverusers\n**Server Profile**\n${prefix}serverbio\n\n**Profile Management**\n\n${prefix}serverremove\n${prefix}serverunremove\n**Server Management**\n${prefix}serverinvite`, inline: false }
                        )
                    }
                    helpEmbed.setTimestamp()
                    helpEmbed.setFooter('© Wezacon.com', 'https://github.com/wezacon/dbos/blob/main/public/img/Wezacon-icon.png?raw=true');
        
            message.channel.send(helpEmbed);
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
    name: "help",
    aliases: []
}