const { Schema, model } = require('mongoose');
const config = require('../config.json');

const GUser = Schema({
    id: String,
    guildID: String,
    serverSuperAdmin: {
        type: Boolean,
        default: false
    },
    serverAdmin: {
        type: Boolean,
        default: false
    },
    siteAdmin: {
        type: Boolean,
        default: false
    },
    siteModerator: {
        type: Boolean,
        default: false
    },
    serverModerator: {
        type: Boolean,
        default: false
    },
    removed: {
        type: Boolean,
        default: false
    },
    removeReason: {
        type: String,
        default: "This user violated our TOS"
    },
    username: {
        type: String,
        default: "User#0000"
    },
    profileImage: {
        type: String,
        default: config.iconUrl
    },
    bio: {
        type: String,
        default: "This user does not have a bio yet"
    },
    messages: { 
        type: Number, 
        default: 0 
    }
});

module.exports = model('GUser', GUser);