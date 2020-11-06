// --- Required librairies ---
const Discord = require('discord.js');
const fs = require('fs');

// --- Required modules ---
const db = require('../db.js');

module.exports.run = async (bot) => {
    // --- Commands loading ---
    bot.commands = new Discord.Collection();
    fs.readdir("./cmds/", (err, files) => {
        if (err) console.log(err);
        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if (jsfiles.length <= 0) {
            return console.log("Error | Filesystem : No command file found");
        }
        jsfiles.forEach((f, _) => {
            let cmd_file = require(`../cmds/${f}`);
            console.log(`Info  | Discord    : ${f} command loaded`);
            bot.commands.set(cmd_file.help.name, cmd_file);
        });
    });

    // --- Command use ----
    bot.on('message', async message => {
        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        let prefix = bot.default_prefix;
        if (db.get("guilds", message.guild.id, "prefix")) prefix = db.get("guilds", message.guild.id, "prefix");
        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);

        let commandFile = bot.commands.get(command.slice(prefix.length));
        if (commandFile) await commandFile.run(bot, message, args);
    });
}

module.exports.help = {
    name: "commands"
}