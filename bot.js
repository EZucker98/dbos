const Discord = require('discord.js');
const config = require('./config.json');
const colors = require('./colors.json');
const system = require('./system.json');
const canvacord = require("canvacord");
const Canvas = require("canvas");
const fs = require('fs');
const bot = new Discord.Client();
var botStatus = config.bot.status.mode;
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const GuildModel = require('./models/Guild');
const UserModel = require('./models/User');
const GUserModel = require('./models/GuildUsers');
const levels = require('./models/Levels');
const { connect } = require('mongoose');
const package = require("./package.json");
const fetch = require("node-fetch");
if(config.bot.status.activity == "default"){
    var botActivity = config.bot.prefix + "help | v" + package.version;  
} else {
    var botActivity = config.bot.status.activity;
}
var blackListMsgStatus = config.bot.moderation.blackListing.enabled;
var blackListMsg = config.bot.moderation.blackListing.errorMessage;
bot.on('ready', async () => {
    console.log('MAIN SHARD ONLINE\n-------------------------')
    if (config.bot.commandLogging == true) {
        console.log('Command logging is now enabled!\n-------------------------');
    } else {
        console.log('Command logging is not enabled!\n-------------------------')
    }
    if (config.bot.messageLogging == true) {
        console.log('Message logging is now enabled!');
    } else {
        console.log('Message logging is not enabled!')
    }
    console.log('----[DATA CONFIGURATING]----');
    await connect(config.db.mongodb, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log('FINISHED!')
    console.log('----[STARTING SHARDS]----')
    function StartShards() {
        fs.readdir("./commands/", (err, files) => {
            if (err) console.log(err);

            let jsfile = files.filter(f => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.log("ERROR: There is not an existing [commands] folder OR there are no files in the [commands] folder!");
            }

            jsfile.forEach((f) => {
                let props = require(`./commands/${f}`);
                console.log(`SHARD: [${f}] IS ONLINE\n-------------------------`);
                bot.commands.set(props.help.name, props);
                props.help.aliases.forEach(alias => {
                    bot.aliases.set(alias, props.help.name);
                })
            })
        })
    }
    setTimeout(StartShards, 1000);
    setTimeout(() => {
        bot.user.setPresence({ activity: { name: botActivity }, status: botStatus })
    }, 2000);


})
bot.on("message", async message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;
    var messageAuthor = message.member.user.tag;
    var AuthorImage = message.author.avatarURL({ dynamic: true });
    if (config.bot.messageLogging == true) { console.log('ML -> [' + message.guild.name + '] -> ' + messageAuthor + ': ' + message.content) }
    const req = await GuildModel.findOne({ id: message.guild.id })
    if (!req) {
        const init = new GuildModel({ id: message.guild.id, name: message.guild.name, icon: message.guild.iconURL() })
        await init.save();

        const oprix = config.bot.prefix;
    } else {
        var oprix = req.prefix;
    }
    const UP = message.member.permissions.toArray();
    if(config.danger.debug == true){
        console.log("[DEBUG] " + messageAuthor + " " + UP)
    }
    const userListed = await UserModel.findOne({ id: message.member.id })
    if (!userListed) {
        const init = new UserModel({ id: message.member.id, username: messageAuthor, profileImage: AuthorImage })
        await init.save();
        message.reply("Your profile has been listed on: " + config.siteUrl + "/user/" + message.member.id + "\nYou can make your profile `private` by using: `"+ oprix +"liststatus (disallow/allow)`\nThis can be changed at any given time and is not needed to be changed.");
    } else {
        const init = await UserModel.findOneAndUpdate({ id: message.member.id }, { username: messageAuthor, profileImage: AuthorImage }, { new: true });
        if (config.danger.debug == true) {
            console.log('[DEBUG] ' + init.username + ' - ADMIN: ' + init.admin + '  ' + init.profileImage);
        }
    }

    const guildIDB = await GuildModel.findOne({ id: message.guild.id })

    if(guildIDB.premium == true){
        const PremUListed = await GUserModel.findOne({ id: message.member.id, guildID: message.guild.id })

        if (!PremUListed) {
            if(message.member.hasPermission("MANAGE_GUILD")){
                const init = new GUserModel({ id: message.member.id, username: messageAuthor, profileImage: AuthorImage, guildID: message.guild.id, serverSuperAdmin: true })
                await init.save();
            } else if(message.member.hasPermission("ADMINISTRATOR")){
                const init = new GUserModel({ id: message.member.id, username: messageAuthor, profileImage: AuthorImage, guildID: message.guild.id, serverSuperAdmin: true })
                await init.save();
            } else if(message.member.hasPermission("BAN_MEMBERS")){
                const init = new GUserModel({ id: message.member.id, username: messageAuthor, profileImage: AuthorImage, guildID: message.guild.id, serverSuperAdmin: true })
                await init.save();
            } else {
                const init = new GUserModel({ id: message.member.id, username: messageAuthor, profileImage: AuthorImage, guildID: message.guild.id })
                await init.save();
            }
            const UIL = await GUserModel.findOne({ id: message.member.id, guildID: message.guild.id })
            if (config.danger.debug == true) {
                console.log('[DEBUG] [PREMIUM LIST] ' + UIL.username + ' - ADMIN: ' + UIL.admin + '  ' + UIL.profileImage);
            }
        } else {
            if(message.member.hasPermission("MANAGE_GUILD")){
                const init = await GUserModel.findOneAndUpdate({ id: message.member.id, guildID: message.guild.id }, { username: messageAuthor, profileImage: AuthorImage, serverSuperAdmin: true }, { new: true });
            } else if(message.member.hasPermission("ADMINISTRATOR")){
                const init = await GUserModel.findOneAndUpdate({ id: message.member.id, guildID: message.guild.id }, { username: messageAuthor, profileImage: AuthorImage, serverSuperAdmin: true }, { new: true });
            } else if(message.member.hasPermission("BAN_MEMBERS")){
                const init = await GUserModel.findOneAndUpdate({ id: message.member.id, guildID: message.guild.id }, { username: messageAuthor, profileImage: AuthorImage, serverSuperAdmin: true }, { new: true });
             } else {
                const init = await GUserModel.findOneAndUpdate({ id: message.member.id, guildID: message.guild.id }, { username: messageAuthor, profileImage: AuthorImage }, { new: true });
            }
            if (config.danger.debug == true) {
                console.log('[DEBUG] [PREMIUM LIST] ' + message.member.user.tag + ' on: ' + message.guild.name);
            }
        }
    }

    if (!message.content.startsWith(oprix)) return;

    if (req.blacklisted == undefined || req.blacklisted == null) {
        const blackListAdd = new GuildModel({ id: message.guild.id, blacklisted: false, name: message.guild.name, icon: message.guild.iconURL() })
        await blackListAdd.save();
    } else {
        if (req.blacklisted == true) {
            if (blackListMsgStatus == true) {
                var MsgActive = true;
            } else {
                var MsgActive = false;
            }
            if (blackListMsg.length <= 0) {
                var cStatus = 'Not delivered.';
            } else {
                var cStatus = blackListMsg;
            }

            if (MsgActive == true) {
                const blackListEmbed = new Discord.MessageEmbed;

                blackListEmbed.setTitle('Server BlackListed!');
                blackListEmbed.setColor(colors.error);
                blackListEmbed.setDescription('Your server was put on a BlackList by the bot ' + system.teamName + '!');
                blackListEmbed.setTimestamp();
                blackListEmbed.addField('Message', cStatus, false)

                return message.channel.send(blackListEmbed);
            }

            if(config.danger.debug == true){
             return console.log('[DEBUG] BLACKLISTED SERVER USED A COMMAND, COMMAND STATUS: ' + cStatus);   
            } else {
             return;
            }
            
        }
    }
    let args = message.content.slice(oprix.length).trim().split(/ +/g);
    let cmd;
    cmd = args.shift().toLocaleLowerCase();
    let commandfile = bot.commands.get(cmd.slice(oprix.length));
    if (commandfile) commandfile.run(bot, message, args);
    if (config.bot.commandLogging == true) { console.log('CL -> ' + message.content + ' command used in: [' + message.guild.name + '] - By: ' + messageAuthor) }
    if (bot.commands.has(cmd)) {
        command = bot.commands.get(cmd);
    } else if (bot.aliases.has(cmd)) {
        command = bot.commands.get(bot.aliases.get(cmd));
    }
    try {
        command.run(bot, message, args);
    } catch (e) {
        return;
    }
})

// bot.on("message", async message => {
//     try {
//         if (message.channel.type === "dm") return;
//         if (message.author.bot) return;
//         var messageAuthor = message.member.user.tag;
//         const AuthorImage = message.author.avatarURL({ dynamic: true });
//         var UID = message.member.id;

//         const guildDB = await GuildModel.findOne({ id: message.guild.id })
//         if (!guildDB) {
//             const init = new GuildModel({ id: message.guild.id })
//             await init.save();
//         }
//         if (guildDB.blacklisted == true) return;

//         const guildDB = await GuildModel.findOne({ id: message.guild.id })
//         if (!guildDB) {
//             const init = new GuildModel({ id: message.guild.id })
//             await init.save();
//         }

//     } catch (error) {
//         const c = require("./colors.json");
//         const Err_1 = new Discord.MessageEmbed()
//             .setColor(c.error)
//             .setTitle("**Error**")
//             .setDescription("I have encountered a unexpected error: `"+ error.message +"`\nplease report this to: https://dbos.flarum.cloud or https://github.com/wezacon/dbos")
//         return message.channel.send(Err_1);
//     }
// });

bot.on("message", async message => {
    try {
        if (message.channel.type === "dm") return;
        if (message.author.bot) return;
        var messageAuthor = message.member.user.tag;
        const AuthorImage = message.author.avatarURL({ dynamic: true });
        var UID = message.member.id;

        const guildDB = await GuildModel.findOne({ id: message.guild.id })
        if (!guildDB) {
        } else {
            const init = GuildModel.findOneAndUpdate({ id: message.guild.id, name: message.guild.name, icon: message.guild.iconURL() })
        }
        if (guildDB.blacklisted == true) return;
        const levelstem = await levels.findOne({ guildID: message.guild.id, userID: UID })
        if (!levelstem) {
            const levelstemInit = new levels({ guildID: message.guild.id, userID: UID, userTag: messageAuthor, userImage: AuthorImage })
            await levelstemInit.save();
        }
        const levelNew = await levels.findOne({ guildID: message.guild.id, userID: UID })

        if(levelNew.level == 0){
            var NXP = 1;
        } else if(levelNew.level == 1){
            var NXP = 2;
        } else {
            var NXP = levelNew.level;
        }

        const clevel = 50;

        var nxp = levelNew.nxp;

        if(config.danger.debug == true){
            console.log("[DEBUG] NXP: " + nxp);
        }

        var gxp = levelNew.xp + 5 + levelNew.level;
        var xp = gxp;
        console.log(xp)
        const levelst = await levels.findOneAndUpdate({ guildID: message.guild.id, userID: UID }, { userTag: messageAuthor, userImage: AuthorImage, xp: xp }, { new: true });
        var cxp = levelst.xp;
        if (config.danger.debug == true) {
            console.log('[DEBUG] CXP: ' + cxp)
            console.log('[DEBUG] ' + levelst.xp + ' - ' + levelst.guildID + ' - ' + levelst.userID + ' - ' + levelst.level + '  -  ' + levelst.userImage);
        }

        try {
            if (gxp >= levelst.nxp) {
                var nxp = "0";
                var level = levelst.level + 1;
                var FXP = levelst.nxp + 50;
                const levelstring = await levels.findOneAndUpdate({ guildID: message.guild.id, userID: UID }, { userTag: messageAuthor, xp: nxp, level: level, nxp: FXP }, { new: true });
                if (config.danger.debug == true) {
                    console.log('[DEBUG] USER LEVELED UP TO ' + levelstring.level + ' XP: ' + levelstring.xp);
                }
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
                    const user = await levels.findOne({ guildID: message.guild.id, userID: UID });
                    const canvas = Canvas.createCanvas(700, 250);
                    const ctx = canvas.getContext('2d');
                    const UserDB = await UserModel.findOne({ id: message.member.id })
                    if (!UserDB) {
                        const init = new UserModel({ id: message.member.id })
                        await init.save();
                        message.reply("Your profile has been listed on: " + config.siteUrl + "/user/" + message.member.id + "\nYou can make your profile `private` by using: `"+ oprix +"liststatus (disallow/allow)`\nThis can be changed at any given time and is not needed to be changed.");
                    }
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

                    // // Slightly smaller text placed above the member's display name
                    // ctx.font = '28px sans-serif';
                    // ctx.fillStyle = '#ffffff';
                    // ctx.fillText('Level ' + user.level, canvas.width / 2.5, canvas.height / 1.8);

                    // // Slightly smaller text placed above the member's display name
                    // ctx.font = '28px sans-serif';
                    // ctx.fillStyle = '#ffffff';
                    // ctx.fillText('You leveled up!', canvas.width / 2.5, canvas.height / 1.4);
                    // if (UserDB.admin == true) {
                    //     const admin = await Canvas.loadImage('https://github.com/wezacon/dbos/blob/main/public/img/moderator.png?raw=true');
                    //     // This uses the canvas dimensions to stretch the image onto the entire canvas
                    //     ctx.drawImage(admin, 200, 190, 50, 50);
                    //     ctx.font = '23px sans-serif';
                    //     ctx.fillStyle = '#ffffff';
                    //     ctx.fillText('Bot Admin', canvas.width / 2.5, canvas.height / 1.2);
                    // }

                    // ctx.beginPath();
                    // ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                    // ctx.closePath();
                    // ctx.clip();

                    // const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'jpg' }));
                    // ctx.drawImage(avatar, 25, 25, 200, 200);

                    // const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rank-dbos.png');

                    // message.channel.send(attachment);
                } catch (error) {
                    const c = require("./colors.json");
                    const Err_1 = new Discord.MessageEmbed()
                        .setColor(c.error)
                        .setTitle("**Error**")
                        .setDescription("I have encountered a unexpected error: `"+ error.message +"`\nplease report this to: https://dbos.flarum.cloud or https://github.com/wezacon/dbos")
                    return message.channel.send(Err_1);
                }
            }
        } catch (error) {
            console.log('[ERROR] ' + error.message)
        }

    } catch (error) {
        const c = require("./colors.json");
        const Err_1 = new Discord.MessageEmbed()
            .setColor(c.error)
            .setTitle("**Error**")
            .setDescription("I have encountered a unexpected error: `"+ error.message +"`\nplease report this to: https://dbos.flarum.cloud or https://github.com/wezacon/dbos")
        return message.channel.send(Err_1);
    }
});

bot.on("guildCreate", async guild => {
    var serverid = guild.id;
    const req = await GuildModel.findOne({ id: serverid, name: guild.name, icon: guild.iconURL() })
    if (!req) {
        const init = new GuildModel({ id: serverid, prefix: config.bot.prefix, name: message.guild.name, icon: message.guild.iconURL() })
        await init.save();
    }

    const log = config.bot.moderation.entryLogging;

    var serverName = guild.name;
    var serverIcon = guild.iconURL({ format: 'webp', dynamic: true });
    var userAmount = guild.memberCount;

    const createEmbed = new Discord.MessageEmbed()
        .setTitle('**New server added**')
        .setColor(colors.info)
        .setDescription(config.siteName + " has been added to a new server!")
        .setTimestamp()
        .setThumbnail(serverIcon)
        .addFields(
            { name: '**Server Info**', value: `**Server ID:** ${serverid}\n**Server Name:** ${serverName}\n**User Count:** ${userAmount}`, inline: false }
        )
        .setFooter('© Wezacon.com')
    if (log.enabled == true) {
        bot.channels.cache.get(log.channelLogId).send(createEmbed);
    }
});

bot.on("guildDelete", guild => {
    const log = config.bot.moderation.entryLogging;
    var serverid = guild.id;

    var serverName = guild.name;
    var serverIcon = guild.iconURL({ format: 'webp', dynamic: true });
    var userAmount = guild.memberCount;

    const deleteEmbed = new Discord.MessageEmbed()
        .setTitle('**Removed from server**')
        .setColor(colors.danger)
        .setDescription(config.siteName + " has been removed from a server.")
        .setTimestamp()
        .setThumbnail(serverIcon)
        .addFields(
            { name: '**Server Info**', value: `**Server ID:** ${serverid}\n**Server Name:** ${serverName}\n**User Count:** ${userAmount}`, inline: false }
        )
        .setFooter('© Wezacon.com')
    if (log.enabled == true) {
        bot.channels.cache.get(log.channelLogId).send(deleteEmbed);
    }
});
bot.on("guildMemberAdd", async member => {
    var UID = member.id;
    const levelstem = await levels.findOne({ guildID: member.guild.id, userID: UID })
    if (!levelstem) {
        const levelstemInit = new levels({ guildID: member.guild.id, userID: UID, userTag: messageAuthor })
        await levelstemInit.save();
    }
});
bot.login(config.bot.token);