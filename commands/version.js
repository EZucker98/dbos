const Discord = require("discord.js");
const config = require('../config.json');
const color = require('../colors.json');
const pack = require('../package.json');

module.exports.run = async (bot, message, args) => {
    const Embed = new Discord.MessageEmbed();
        Embed.setColor(color.info);
        Embed.setTitle('**Version control**')
        Embed.setURL(config.siteUrl)
        Embed.addFields(
            { name: '**Bot Version**', value: `${config.bot.ver}`, inline: true },
            { name: '**Template Version**', value: `${pack.version} - Author: [${pack.author}](${pack.homepage})`, inline: true }, // Do *not* remove the author otherwise the licence will be broken and copyright issues will be in place!
        )
    message.channel.send(Embed);
}

module.exports.help = {
    name: "version",
    aliases: ["vc"]
}