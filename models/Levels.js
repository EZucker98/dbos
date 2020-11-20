const { Schema, model } = require('mongoose');
const config = require('../config.json');

const levels = Schema({
    userID: { type: String },
    guildID: { type: String },
    userTag: { type: String },
    userImage: { type: String },
    xp: { type: Number, default: 0 },
    nxp: { type: Number, default: 200 },
    level: { type: Number, default: 0 },
    siteAdmin: { type: Boolean, default: false },
    siteModerator: { type: Boolean, default: false },
    siteBugBuster: {type: Boolean,default: false},
    sitePartner: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: new Date() }
});

module.exports = model('levels', levels);