const { Message } = require('discord.js');
const { Schema, model } = require('mongoose');
const config = require('../config.json');

const Guild = Schema({
    id: String,
    prefix: {
        type: String,
        default: config.bot.prefix
    },
    logChannel: {
        type: String,
        default: "none"
    },
    name: {
        type: String,
        default: "message.guild.name"
    },
    icon: {
        type: String,
        default: "message.guild.iconURL()"
    },
    blacklisted: {
        type: Boolean,
        default: false
    }, 
    premium: {
        type: Boolean,
        default: false
    },
    invite: {
        type: String,
        default: "none"
    },
    listed: {
        type: String,
        default: "unlisted"
    },
    listedDescription: {
        type: String,
        default: "No description was provided"
    }
});

module.exports = model('Guild', Guild);