const express = require("express");
const router = express.Router();
const discordBot = require("../bot");
const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require('../config.json');
const app = express();
app.set('view engine', 'ejs');
const Levels = require('discord-xp');
const UserModel = require('../models/User');
const GUserModel = require("../models/GuildUsers");
const GuildModel = require('../models/Guild');
const levels = require('../models/Levels');

router.get("/", async function(request, response) {
  try {
    let ServerNUM = bot.guilds.cache.size;
    response.render("../views/index.ejs", {
      SiteName: config.siteName,
      icon: config.iconUrl,
      ServerCount: ServerNUM
    });
  } catch (error) {
    response.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
  }

});

router.get("/invite", function(request, response) {
  response.redirect("https://discordapp.com/api/oauth2/authorize?client_id="+ config.bot.id +"&permissions=470023303&scope=bot");
});
router.get("/easter", function(request, response){
  try { 
    response.render("../views/easteregg.ejs", {
      icon: config.iconUrl,
      SiteName: config.siteName
    });
  } catch (error) {
    res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
  }

});
router.get("/users", async (req, res, next) => {
  try {
    // const Nusers = await UserModel.find({ dataCleared: false }).sort({ messages: -1 }).limit(100).exec();
    const Nusers = await UserModel.find({}).sort({ messages: -1 }).limit(100).exec();
    // const Rusers = await Nusers.aggregate([{ $sample: { size: 100 } }]);
    //  || user.dataCleared == null || user.dataCleared == undefined || user.dataCleared == false
    let data = {
      // rusers: Rusers,
      nusers: Nusers,
      icon: config.iconUrl,
      SiteName: config.siteName
    }
    res.render("../views/dashboard/users.ejs", data);
  } catch (error) {
    res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
  }
});

router.get("/p/servers", async (req, res, next) => {
  try {
    const Nusers = await GuildModel.find({ premium: true }).sort({$natural:-1});
    // const Rusers = await Nusers.aggregate([{ $sample: { size: 100 } }]);

    let data = {
      // rusers: Rusers,
      guilds: Nusers,
      icon: config.iconUrl,
      SiteName: config.siteName
    }
    res.render("../views/dashboard/p/servers.ejs", data);
  } catch (error) {
    res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
  }
});


router.get("/user/:id", async (req, res, next) => {
    const user = await bot.users.fetch(req.params.id);
    if (!user) return res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName})
    const userListed = await UserModel.findOne({ id: req.params.id });
    try {
      if(userListed){
          if(userListed.dataCleared == true) return res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: "This user removed their data"});
          let VERIFIED_DEVELOPER = (await user.fetchFlags()).has("VERIFIED_DEVELOPER")
            
          if(userListed.bio == "" || userListed.bio == undefined || userListed.bio == null){
            var userBio = "This user does not have a bio yet.";
          } else {
            var userBio = userListed.bio;
          }

          if(userListed.discordServer == "" || userListed.discordServer == undefined || userListed.discordServer == null || userListed.discordServer == "none"){
            var hasServer = false;
          } else {
            var hasServer = true;
          }
          if(userListed.github == "" || userListed.github == undefined || userListed.github == null || userListed.github == "none"){
            var hasGit = false;
          } else {
            var hasGit = true;
          }

          if(userListed.occupation == "" || userListed.occupation == undefined || userListed.occupation == null || userListed.occupation == "none"){
            var hasWork = false;
          } else {
            var hasWork = true;
          }

            let data = {
                user: req.user,
                userProfile: user,
                dbuser: userListed,
                developer: VERIFIED_DEVELOPER ,
                isProfile: true,
                avatar: user.displayAvatarURL({ dynamic: true }),
                username: userListed.username,
                admin: userListed.admin,
                contributor: userListed.contributor,
                verified: userListed.verified,
                bio: userBio,
                hasServer: hasServer,
                hasGit: hasGit,
                hasWork: hasWork,
                occupation: userListed.occupation,
                gitLink: userListed.github,
                serverInvite: userListed.discordServer,
                icon: config.iconUrl,
                SiteName: config.siteName
            }
        res.render("../views/dashboard/user.ejs", data);
      } else {
        var cerr = "Unknown error.";
        res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
      }
    } catch (error) {
      res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
  }
});

router.get("/:id/leaderboard", async (req, res, next) => {
  const guildSingle = await bot.guilds.fetch(req.params.id);
  if (!guildSingle) return res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName})
  const Server = await GuildModel.findOne({ id: req.params.id });
  try {
    if(Server){
      if(Server.blacklisted == true){
        var cerr = "This server was blacklisted.";
        res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
      } 
      if(Server.invite == "none" || Server.invite == null || Server.invite == undefined){
        var invAv = false;
      } else {
        var invAv = true;
      }
          var users = await levels.find({ guildID: req.params.id }).sort({ level: -1, xp: -1 }).limit(100).exec();
          let data = {
              Udata: users,
              server: req.server,
              serverCore: guildSingle,
              GuildDB: Server,
              hasInv: invAv,
              isProfile: true,
              icon: config.iconUrl,
              SiteName: config.siteName
          }
      res.render("../views/dashboard/leaderboard.ejs", data);
    } else {
      var cerr = "Unknown error.";
      res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
    }
  } catch (error) {
    res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
}
});

router.get("/s/:id/users", async (req, res, next) => {
  const guildSingle = await bot.guilds.fetch(req.params.id);
  if (!guildSingle) return res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: "Guild not found"})
  const Server = await GuildModel.findOne({ id: req.params.id });
  try {
    if(Server){
      if(Server.blacklisted == true){
        var cerr = "This server was blacklisted.";
        res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
      } 
    const Nusers = await GUserModel.find({ guildID: req.params.id }).sort({ messages: -1 }).limit(100).exec();
    // const Rusers = await Nusers.aggregate([{ $sample: { size: 100 } }]);
    if(Server.invite == "none" || Server.invite == null || Server.invite == undefined){
      var invAv = false;
    } else {
      var invAv = true;
    }
    let data = {
      serverCore: guildSingle,
      GuildDB: Server,
      nusers: Nusers,
      hasInv: invAv,
      icon: config.iconUrl,
      SiteName: config.siteName
    }
    res.render("../views/dashboard/s/users.ejs", data);
  } else {
    var cerr = "Unknown error.";
    res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
  }
  } catch (error) {
    res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
  }
});

router.get("/s/:id/u/:userID", async (req, res, next) => {
  const user = await bot.users.fetch(req.params.userID);
  if (!user) return res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: "Something went wrong: [UID]"})
  const userListed = await GUserModel.findOne({ id: req.params.userID, guildID: req.params.id });

  const Guild = await bot.guilds.fetch(req.params.id);
  if (!Guild) return res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: "Something went wrong: [GID]"})
  const GuildListed = await GuildModel.findOne({ id: req.params.id });
  if(!GuildListed) return res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: "Something went wrong [GID]"});
  try {
    if(userListed){
        let VERIFIED_DEVELOPER = (await user.fetchFlags()).has("VERIFIED_DEVELOPER");

          let data = {
              user: req.user,
              userProfile: user,
              guild: GuildListed,
              dguild: Guild,
              dbuser: userListed,
              developer: VERIFIED_DEVELOPER ,
              isProfile: true,
              avatar: user.displayAvatarURL({ dynamic: true }),
              username: userListed.username,
              bio: userListed.bio,
              icon: config.iconUrl,
              SiteName: config.siteName
          }
      res.render("../views/dashboard/s/user.ejs", data);
    } else {
      var cerr = "Unknown error.";
      res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
    }
  } catch (error) {
    res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
}
});
router.get("/docs", async (req, res) => {
  let data = {
    icon: config.iconUrl,
    SiteName: config.siteName
  }
  res.render("../views/dashboard/docs/home.ejs", data);
});
router.get("/s/:id", async (req, res, next) => {
  const guildSingle = await bot.guilds.fetch(req.params.id);
  if (!guildSingle) return res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName})
  const Server = await GuildModel.findOne({ id: req.params.id });
  try {
    if(Server){
      if(Server.blacklisted == true){
        var cerr = "This server was blacklisted.";
        res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
      } 
        if(Server.invite == "none" || Server.invite == null || Server.invite == undefined){
          var invAv = false;
        } else {
          var invAv = true;
        }
          let data = {
              server: req.server,
              serverCore: guildSingle,
              GuildDB: Server,
              isProfile: true,
              icon: config.iconUrl,
              hasInv: invAv,
              Invite: Server.invite,
              SiteName: config.siteName
          }
      res.render("../views/dashboard/s/home.ejs", data);
    } else {
      var cerr = "Unknown error.";
      res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
    }
  } catch (error) {
    res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
}
});

router.get("/servers", async (req, res, next) => {
  try {
    const Nusers = await GuildModel.find({ premium: true }).sort({$natural:-1});
    // const Rusers = await Nusers.aggregate([{ $sample: { size: 100 } }]);

    let data = {
      // rusers: Rusers,
      guilds: Nusers,
      icon: config.iconUrl,
      SiteName: config.siteName
    }
    res.render("../views/dashboard/s/serverlist.ejs", data);
  } catch (error) {
    res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
  }
});

router.get("/g/:id/info", async (req, res, next) => {
  const guildSingle = await bot.guilds.fetch(req.params.id);
  if (!guildSingle) return res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName})
  const Server = await GuildModel.findOne({ id: req.params.id });
  try {
    if(Server){
      if(Server.blacklisted == true){
        var cerr = "This server was blacklisted.";
        res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
      } 
      if(Server.listed == "false"){
        var cerr = "This server was blacklisted.";
        res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
      } 
        if(Server.invite == "none" || Server.invite == null || Server.invite == undefined){
          var invAv = false;
        } else {
          var invAv = true;
        }
          let data = {
              server: req.server,
              serverCore: guildSingle,
              GuildDB: Server,
              isProfile: true,
              icon: config.iconUrl,
              hasInv: invAv,
              Invite: Server.invite,
              SiteName: config.siteName
          }
      res.render("../views/dashboard/s/l/info.ejs", data);
    } else {
      var cerr = "Unknown error.";
      res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: cerr});
    }
  } catch (error) {
    res.render("../views/errors/404.ejs", {icon: config.iconUrl, SiteName: config.siteName, Error: error.message});
}
});
// if 404
router.get("*", function(request, response) {
  response.render("../views/errors/404.ejs", {
    icon: config.iconUrl,
    SiteName: config.siteName
  });
});

bot.login(config.bot.token)
console.log('------------[ACTIVATING]-------------\nSHARD: guides.js ONLINE - This is a standalone shard!\n-------------------------')
module.exports = router;