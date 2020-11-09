const express = require("express");
const app = express();
const router = express.Router();
const discordBot = require("../bot");
const config = require('../config.json');
const passport = require("passport");
const session  = require('express-session');

var DiscordStrategy = require('passport-discord').Strategy;

var scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.use(new DiscordStrategy({
    clientID: config.bot.id,
    clientSecret: config.bot.secret,
    callbackURL: 'http://localhost:5000/callback',
    scope: scopes,
    prompt: "none"
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));
app.use(session({
    secret: 'Some unreal engine',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.get('/login', passport.authenticate('discord', { scope: scopes, prompt: "none" }), function(req, res) {});
app.get('/D/callback',
    passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { res.redirect('/info') } // auth success
);
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/api/l/info', checkAuth, function(req, res) {
    //console.log(req.user)
    res.json(req.user);
});
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}
console.log('------------[ACTIVATING]-------------\nSHARD: api.dis.oauth.js ONLINE - This is a standalone shard!\n-------------------------')
module.exports = router;