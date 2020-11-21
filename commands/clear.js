const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
  try {
        const amount = args.join(" ");

     if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply('You don\'t have the following permissions: `MANAGE_MESSAGES`.');
     if(isNaN(args[0])) return message.reply('Please specify a number of messages between: 2\ - 100.');
    if(args[0] > 100) return message.reply('You can not delete over 100 messages at once.');
     if(args[0] < 1) return message.reply('You need to delete atleast 1 message.');
     message.channel.bulkDelete(args[0])
       .then(messages => message.reply(`Successfully deleted **${amount}** messages.`))
       .catch((err) => message.reply('Error: ' + err));

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
    name: "clear",
    aliases: ["prune"]
}