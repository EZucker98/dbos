const Discord = require("discord.js");
const Levels = require('discord-xp');
const c = require("../colors.json");
const Canvas = require("canvas");
const config = require("../config.json");
const UserModel = require('../models/User');
const GUserModel = require("../models/GuildUsers");
const canvacord = require("canvacord");
module.exports.run = async (bot, message, args) => {
    try {
        if(!message.guild.id == config.bot.moderation.server.id) return;
        if(!message.member.roles.cache.has(config.bot.moderation.server.superAdminRoleId)) return message.reply("You are not a `super admin`!");

            message.reply("Clearing all messages from `all` users, please wait!");

            const globalList = await UserModel.find();
            const serverList = await GUserModel.find();
            globalList.forEach(async (x) => {
                const reset = await UserModel.findOneAndUpdate({ id: x.id }, { messages: 0 });
            });
            serverList.forEach(async (x) => {
                const reset = await GUserModel.findOneAndUpdate({ id: x.id }, { messages: 0 });
            });

            message.reply("All messages where cleared!");

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
    name: "resetmessages",
    aliases: []
}