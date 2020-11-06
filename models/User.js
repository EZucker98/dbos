const { Schema, model } = require('mongoose');
const config = require('../config.json');

const User = Schema({
    id: String,
    admin: {
        type: Boolean,
        default: false
    },
    contributor: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    allowListing: {
        type: Boolean,
        default: true
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
    github: {
        type: String,
        default: "none"
    },
    discordServer: {
        type: String,
        default: "none"
    }
});

module.exports = model('User', User);