const express = require("express");
const router = express.Router();
const Config = require('../config.json');
const Discord = require("discord.js");
const bot = new Discord.Client();
const userModel = require("../models/User");
const GuildUser = require("../models/GuildUsers");
const GuildModel = require("../models/Guild");
const userLevels = require("../models/Levels");
const Levels = require("../models/Levels");
router.get("/api/domain", function(request, response) {
    let domain = Config.siteUrl;
    let port = Config.port
    response.status(200).json({
      url: domain,
      port: port
    });
  });
router.get("/api/server", function(request, response){
    let serverInv = Config.server.invite;
    response.status(200).json({
        inviteCode: serverInv
    });
});
router.get("/s/join", function(request, response){
    let serverInv = Config.server.invite;
    response.redirect('https://discord.gg/invite/' + serverInv)
});
router.get("/api/bot", async function(request, response) {
    let authURL;
    let domain = process.env.PROJECT_DOMAIN;
    let uptime = process.uptime();
    let ID = Config.bot.id;
    try {
      authURL =
        "https://discordapp.com/api/oauth2/authorize?client_id=" +
        Config.bot.id +
        "&permissions=8&scope=bot";
    } catch (e) {
      console.error(e);
    }
    response.status(200).json({
      url: authURL,
      invite: Config.server.invite,
      uptime: uptime,
      Clientid: ID
  });
});


router.get("/api/b/version", async function(request, response) {

    var VNUM = Config.bot.ver;

    if(VNUM == "null" || VNUM == "undefined"){
      var VNUMF = "0.0.0";
    } else {
      var VNUMF = VNUM;
    }

  response.status(200).json({
    version: VNUMF
});
});

router.get('/api/all/info', async function(req, res){
  try {
    let domain = Config.siteUrl;
    let uptimems = process.uptime();
    let ID = Config.bot.id;
    let ownerName = Config.owner;
    let port = Config.port;
    let authURL = domain + '/inv/bot';
  
    res.render("../views/api/info.ejs", {
      SiteName: Config.siteName,
      icon: Config.iconUrl,
      invite: authURL,
      domain: domain,
      port: port,
      id: ID,
      owner: ownerName
    });
  } catch (error) {
    res.render("../views/errors/404.ejs", {icon: Config.iconUrl, SiteName: Config.siteName, Error: error.message});
  }
});

router.get('/inv/bot', async function(req, res){
  let authURL;
  try {
    authURL =
      "https://discordapp.com/api/oauth2/authorize?client_id=" +
      Config.bot.id +
      "&permissions=8&scope=bot";
  } catch (e) {
    console.error(e);
  }
  res.redirect(authURL)
});

router.get('/api/global/u/:id', async function(req, res){
    const userid = req.params.id;
    const user = await userModel.findOne({ id: userid }).exec();
    if(!user) {
      res.status(404).json({
        code: 404,
        message: "User not found"
      })
    }
    if(user.dataCleared == true){
      res.status(401).json({
        code: 401,
        message: "User has cleared their data"
      })      
    }
    if(user.removed == true){
      res.status(410).json({
        code: 410,
        message: "User was removed"
      })      
    }
    res.status(200).json({
      user
      // id: user.id,
      // username: user.username,
      // bio: user.bio,
      // occupation: user.occupation
    })
});
router.get('/api/s/:gid/u/:id/level', async function(req, res){
  const userid = req.params.id;
  const guildid = req.params.gid;
  const user = await userLevels.findOne({ userID: userid, guildID: guildid }).exec();
  const guild = await GuildModel.findOne({ id: guildid });
  if(!user) {
    res.status(404).json({
      code: 404,
      message: "User not found"
    })
  }
  if(!guild) {
    res.status(404).json({
      code: 404,
      message: "Guild not found"
    })
  }
  if(guild.blacklisted == true){
    res.status(401).json({
      code: 401,
      message: "Guild was blacklisted"
    });
  }
  res.status(200).json({
    user
    // id: user.id,
    // username: user.username,
    // bio: user.bio,
    // occupation: user.occupation
  })
});
router.get('/api/s/:gid/u/:id', async function(req, res){
  const userid = req.params.id;
  const guildid = req.params.gid;
  const guild = await GuildModel.findOne({ id: guildid }).exec();
  const user = await GuildUser.findOne({ id: userid, guildID: guildid }).exec();
  if(!guildid){
    res.status(404).json({
      code: 404,
      message: "Unknown guild id"
    })
  }
  if(!userid){
    res.status(404).json({
      code: 404,
      message: "Unknown user id"
    })
  }
  if(!user) {
    res.status(404).json({
      code: 404,
      message: "User not found"
    })
  }
  if(guild.premium == false){
    res.status(401).json({
      code: 401,
      message: "This guild does not have premium!"
    })      
  }
  if(guild.blacklisted == true){
    res.status(401).json({
      code: 401,
      message: "This guild was blacklisted"
    })      
  }
  if(user.removed == true){
    res.status(410).json({
      code: 410,
      message: "User was removed"
    })      
  }
  res.status(200).json({
    user
    // id: user.id,
    // username: user.username,
    // bio: user.bio,
    // occupation: user.occupation
  })
});
router.get('/api/global/s/:gid', async function(req, res){
  const guildid = req.params.gid;
  const guild = await GuildModel.findOne({ id: guildid }).exec();
  if(!guildid){
    res.status(404).json({
      code: 404,
      message: "Unknown guild id"
    })
  }
  if(!guild) {
    res.status(404).json({
      code: 404,
      message: "User not found"
    })
  }
  if(guild.blacklisted == true){
    res.status(401).json({
      code: 401,
      message: "This guild was blacklisted"
    })      
  }
  res.status(200).json({
    guild
    // id: user.id,
    // username: user.username,
    // bio: user.bio,
    // occupation: user.occupation
  })
});

router.get('/api/g/u/all', async function(req, res){
  const users = await userModel.find().limit(100).exec();
  if(!users) {
    res.status(404).json({
      code: 404,
      message: "User not found"
    })
  }
  res.status(200).json({
    users
  })
});
router.get('/api/u/s/:id/all', async function(req, res){
  const guildid = req.params.id;
  if(!guildid){
    res.status(404).json({
      code: 404,
      message: "User not found"
    })
  }
  const users = await GuildUser.find({ guildID: guildid }).limit(100).exec();
  if(!users) {
    res.status(404).json({
      code: 404,
      message: "User not found"
    })
  }
  res.status(200).json({
    users
  })
});

router.get('/api/s/:id/levels', async function(req, res){
  const guildid = req.params.id;
  if(!guildid){
    res.status(404).json({
      code: 404,
      message: "ID not found"
    })
  }
  const levels = await Levels.find({ guildID: guildid }).limit(100).exec();
  if(!levels) {
    res.status(404).json({
      code: 404,
      message: "Nothing found in the database"
    })
  }
  res.status(200).json({
    levels
  })
});

router.get('/api/:select/s/all', async function(req, res){
  const selection = req.params.select;
  if(selection == "premium"){
    var slc = { premium: true }
  } else {
    var slc = {} 
  }
  const guilds = await GuildModel.find(slc).limit(100).exec();
  if(!guilds) {
    res.status(404).json({
      code: 404,
      message: "User not found"
    })
  }
  res.status(200).json({
    guilds
  })
});
console.log('------------[ACTIVATING]-------------\nSHARD: api.js ONLINE - This is a standalone shard!\n-------------------------')
module.exports = router;