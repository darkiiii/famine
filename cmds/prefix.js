// --- Required modules ---
const db = require('../db.js');

module.exports.run = async (bot, message, args) => {
    if (!args[0]) {
        message.delete();
        return message.channel.send("Le nouveau préfixe est invalide, il n'a pas été changé")
    };
    db.set("guilds", message.guild.id, "prefix", args[0]);
    message.channel.send("Le préfixe a été changé pour : **" + args[0] + "**");
    message.delete();
}

module.exports.help = {
    name: "prefix"
}