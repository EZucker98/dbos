const colors = require("../colors.json");
const Discord = require("discord.js");
const GuildModel = require("../models/Guild");
module.exports.run = async (bot, message, args) => {
    try {
        const guild = await GuildModel.findOne({ id: message.guild.id });
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send('I cannot do this! You do not have the `manage messages` permission');
        if (!args[0]) return message.channel.send('Failed to send poll! please use: `'+ guild.prefix +'poll (your custom poll description)`');
    
        var user = message.author;
        let msgArgs = args.slice(0).join(" ");
        let embed2 = new Discord.MessageEmbed()
        .setColor(colors.info)
        .setAuthor(message.member.user.tag, message.author.displayAvatarURL({ dynamic: true, format: 'webp' }))
        .setDescription(msgArgs)
        return message.channel.send(embed2).then(messageReaction => {
            messageReaction.react("⬆️");
            messageReaction.react("⬇️");
            message.delete();
        })
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
    name: "poll",
    aliases: ["vote"]
}