const Discord = require("discord.js");
const Levels = require('discord-xp');
const c = require("../colors.json");
const Canvas = require("canvas");
const config = require("../config.json");
const UserModel = require('../models/User');
const levels = require("../models/Levels");
const canvacord = require("canvacord");
module.exports.run = async (bot, message, args) => {
    try {
        if(config.danger.debug == true){
            console.log("[DEBUG] RANK.JS HAS ALMOST BEEN STARTED!")
        }
        var UID = message.member.id;
    const user = await levels.findOne({ guildID: message.guild.id, userID: UID });

    // const embed = new Discord.MessageEmbed()
    //     .setColor(c.gold)
    //     .setAuthor(`${message.member.user.tag}`, message.author.displayAvatarURL())
    //     .setDescription(`You are currently level **${user.level}**!`)
    // message.channel.send(embed)
    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
    
        // Declare a base size of the font
        let fontSize = 70;
    
        do {
            // Assign the font to the context and decrement it so it can be measured again
            ctx.font = `${fontSize -= 10}px sans-serif`;
            // Compare pixel width of the text to the canvas minus the approximate avatar size
        } while (ctx.measureText(text).width > canvas.width - 300);
    
        // Return the result to use in the actual canvas
        return ctx.font;
    };
    try {
        if(config.danger.debug == true){
            console.log("[DEBUG] RANK.JS HAS REACHED THE MIDDLE!")
        }
        const user = await levels.findOne({userID: message.author.id, guildID: message.guild.id});
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        const UserDB = await UserModel.findOne({ id: message.member.id })
        if(!UserDB){
            const init = new UserModel({ id: message.member.id })
            await init.save();
        }

        if(user.level == 0){
            const NXP = 1;
        } else if(user.level == 1){
            const NXP = 2;
        } else {
            const NXP = user.level;
        }
        
        const clevel = 50;
        
        const nxp = user.nxp;
    
        const rank = new canvacord.Rank()
            .setAvatar(message.author.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(user.xp)
            .setRequiredXP(user.nxp)
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(message.author.username)
            .setDiscriminator(message.author.discriminator)
            .setRank(user.level, 'LEVEL UP', false)
            .setLevel(user.level, 'LEVEL', true)
            .setStatus("offline")
            
        rank.build()
            	.then(data => {
                    const attmnt = new Discord.MessageAttachment(data, 'DBOS_rank_card.png');
                    return message.channel.send(attmnt);
                });

    	// const background = await Canvas.loadImage('https://github.com/wezacon/dbos/blob/main/public/img/3377470.jpg?raw=true');
	    // ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        // // Add an exclamation point here and below
        // ctx.font = applyText(canvas, `${message.member.user.tag}`);
        // ctx.fillStyle = '#ffffff';
        // ctx.fillText(`${message.member.user.tag}`, canvas.width / 2.5, canvas.height / 2.5);
    
        //         // Slightly smaller text placed above the member's display name
        //         ctx.font = '28px sans-serif';
        //         ctx.fillStyle = '#ffffff';
        //         ctx.fillText('Level ' + user.level, canvas.width / 2.5, canvas.height / 1.8);
            
        //         // Slightly smaller text placed above the member's display name
        //         ctx.font = '28px sans-serif';
        //         ctx.fillStyle = '#ffffff';
        //         ctx.fillText('XP: ' + user.xp + ' / ' + nxp, canvas.width / 2.5, canvas.height / 1.4);
        //         if(config.danger.debug == true){
        //             console.log("[DEBUG] RANK.JS IS NEAR THE END!")
        //         }
        // if(UserDB.admin == true) {
        //     const admin = await Canvas.loadImage('https://github.com/wezacon/dbos/blob/main/public/img/moderator.png?raw=true');
        //     // This uses the canvas dimensions to stretch the image onto the entire canvas
        //     ctx.drawImage(admin, 200, 190, 50, 50);
        //     ctx.font = '23px sans-serif';
        //     ctx.fillStyle = '#49a1ff';
        //     ctx.fillText('Bot Admin', canvas.width / 2.5, canvas.height / 1.2);
        // }   

        // ctx.beginPath();
        // ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        // ctx.closePath();
        // ctx.clip();
    
        // const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'jpg' }));
        // ctx.drawImage(avatar, 25, 25, 200, 200);
    
        // const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rank-dbos.png');
        // if(config.danger.debug == true){
        //     console.log("[DEBUG] RANK.JS HAS ALMOST BEEN COMPLETED!")
        // }
        // message.channel.send(attachment).catch(error => {
        //     console.log(error);
        // });

        // const embed = new Discord.MessageEmbed()
        //         .setColor(c.info)
        //         .setTitle("**User Info**")
        //         .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ format: 'jpg' }))
        //         .addFields(
        //             { name: '**Level**', value: `${user.level}`, inline: false },
        //             { name: '**XP**', value: `${user.xp}`, inline: false }
        //         )
        // return message.channel.send(embed)
      } catch (error) {
                const c = require("../colors.json");
        const Err_1 = new Discord.MessageEmbed()
            .setColor(c.error)
            .setTitle("**Error**")
            .setDescription("I have encountered a unexpected error: `"+ error.message +"`\nplease report this to: https://dbos.flarum.cloud or https://github.com/wezacon/dbos")
        return message.channel.send(Err_1);
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
    name: "rank",
    aliases: ["level"]
}