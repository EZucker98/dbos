const { Schema, model } = require('mongoose');
const config = require('../config.json');

const User = Schema({
    id: String,
    guildID: String,
    serverOwner: {
        type: Boolean,
        default: false
    },
    serverAdmin: {
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
    }
});

module.exports = model('User', User);