// --- Required librairies ---
const Discord = require('discord.js');
const fs = require('fs');

// --- Required modules ---
const db = require('./db.js');

// --- Bot client creation ---
const bot = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

let default_prefix;

// --- Commands loading ---
bot.commands = new Discord.Collection();
fs.readdir("./cmds/", (err, files) => {
    if(err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0){
        return console.log("Error | Filesystem : No command file found");
    }
    jsfiles.forEach((f, _) => {
        let cmd_file = require(`./cmds/${f}`);
        console.log(`Info  | Discord    : ${f} module loaded`);
        bot.commands.set(cmd_file.help.name, cmd_file);
    });
});

// --- Local discord client module (discord) ---
bot.on('ready', _ => {
    console.log("Info  | Discord    : Client ready");
});

bot.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    
    let prefix = default_prefix;
    if (db.get("guilds", message.guild.id, "prefix")) prefix = db.get("guilds", message.guild.id, "prefix");
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let commandFile = bot.commands.get(command.slice(prefix.length));
    if (commandFile) await commandFile.run(bot, message, args);
});

bot.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    let reacJson = db.get("reactcollectors", reaction.message.channel.id, reaction.message.id);

    for (var emote in reacJson) {
        if (reaction.emoji.toString() === emote) {
            if (reacJson[emote]["action"] === "setrole") {
                for (var i = 0; i < reacJson[emote]["action_args"].length; i++) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(reacJson[emote]["action_args"][i]);
                }
            }
        }
    }
});

bot.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    let reacJson = db.get("reactcollectors", reaction.message.channel.id, reaction.message.id);

    for (var emote in reacJson) {
        if (reaction.emoji.toString() === emote) {
            if (reacJson[emote]["action"] === "setrole") {
                for (var i = 0; i < reacJson[emote]["action_args"].length; i++) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(reacJson[emote]["action_args"][i]);
                }
            }
        }
    }
});

// --- Module for external uses (for web, ect) ---
module.exports = {
    login: function (token, prefix) {
        bot.login(token);
        default_prefix = prefix;
    },
    destroy: function () {
        bot.destroy();
        console.log("Info  | Discord    : Client destroyed");
    },
    cmds: bot.commands
};