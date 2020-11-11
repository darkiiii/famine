// --- Required librairies ---
const Discord = require('discord.js');
const fs = require('fs');

// --- Bot client creation ---
const bot = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION", "USER"]});

// --- Global var creation ---
bot.default_prefix = new String();

// --- Modules loading ---
bot.modules = new Discord.Collection();
fs.readdir("./discord_modules/", (err, files) => {
    if (err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        return console.log("Error | Filesystem : No discord module found");
    }
    jsfiles.forEach((f, _) => {
        let mod_file = require(`./discord_modules/${f}`);
        mod_file.run(bot);
        bot.modules.set(mod_file.help.name, mod_file);
        console.log(`Info  | Discord    : ${f} module loaded`);
    });
});

// --- Local discord client module (discord) ---
bot.on('ready', _ => {
    console.log("Info  | Discord    : Client ready");
});

// --- Module for external uses (for web, ect) ---
module.exports = {
    login: function (token, prefix) {
        bot.login(token);
        bot.default_prefix = prefix;
    },
    destroy: function () {
        bot.destroy();
        console.log("Info  | Discord    : Client destroyed");
    },
    cmds: bot.commands
};