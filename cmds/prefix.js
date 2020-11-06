// --- Required modules ---
const db = require('../db.js');

module.exports.run = async (bot, message, args) => {
    if (!args[0]) {
        msg = await message.channel.send("Le nouveau préfixe est invalide, il n'a pas été changé");
        message.delete();
        msg.delete({timeout: 5000});
        return;
    };
    db.set("guilds", message.guild.id, "prefix", args[0]);
    msg = await message.channel.send("Le préfixe a été changé pour : **" + args[0] + "**");
    message.delete();
    msg.delete({timeout: 5000});
}

module.exports.help = {
    name: "prefix"
}
