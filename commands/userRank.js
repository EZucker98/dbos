const Discord = require("discord.js");
const config = require("../config.json");
const colors = require("../colors.json")
const GuildModel = require("../models/Guild");
const UserModel = require("../models/User")
module.exports.run = async (bot, message, args) => {
    try {
        const guildData = await GuildModel.findOne({ id: message.guild.id })
        if(!message.guild.id == config.bot.moderation.server.id) return;
        if(!message.member.roles.cache.has(config.bot.moderation.server.adminRoleId)) return;
        const Target = args[0];
        const Rank = args[1];
    
        if(!Target) return message.channel.send("Please insert a valid user ID")
        if(Target == config.bot.id) return message.channel.send("Please insert a valid user ID");
        if(!Rank) return message.channel.send("Please use the command like this: `"+ guildData.prefix +"setuser (userid) (rank)`\nAvailable ranks: `admin, contributor, verified`")

        const TargetData = await UserModel.findOne({ id: Target });
        if(!TargetData) return message.channel.send("User not found.");

        if(Rank == "contributor") {
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { contributor: true }}, { new: true });
            return message.channel.send("Updated user, they are now a contributor!");
        } else if(Rank == "verified") {
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { verified: true }}, { new: true });
            return message.channel.send("Updated user, they are now verified!");
        } else if(Rank == "admin") {
             if(!message.member.roles.cache.has(config.bot.moderation.server.superAdminRoleId)) return message.reply("You are not a super admin.");
            const doc = await UserModel.findOneAndUpdate({ id: Target}, { $set: { admin: true }}, { new: true });
            return message.channel.send("Updated user, they are now a admin!");
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
    name: "setuser",
    aliases: []
}