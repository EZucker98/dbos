const { Message } = require('discord.js');
const { Schema, model } = require('mongoose');
const config = require('../config.json');

const Guild = Schema({
    id: String,
    prefix: {
        type: String,
        default: config.bot.prefix
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
    }
});

module.exports = model('Guild', Guild);