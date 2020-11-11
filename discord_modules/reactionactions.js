// --- Required modules ---
const db = require('../db.js');

module.exports.run = async (bot) => {


    bot.on('ready', async _ => {
        let reacTable = db.getTable("reactionactions");
        for (var channId in reacTable) {
			await bot.channels.fetch(channId);
            await bot.channels.cache.get(channId).messages.fetch();
            for (var msgId in reacTable[channId]) {
                msg = await bot.channels.cache.get(channId).messages.cache.get(msgId);
				if (msg.partial) msg.fetch();
            }
        }
    });

    bot.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;

        let reacJson = db.get("reactionactions", reaction.message.channel.id, reaction.message.id);
        
        for (var emote in reacJson) {
            if (reaction.emoji.toString() === emote) {
                if (reacJson[emote]["action"] === "setrole") {
                    for (var i = 0; i < reacJson[emote]["action_args"].length; i++) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(reacJson[emote]["action_args"][i]);
                        console.log("Info  | Discord    : Autorole added " + reaction.message.guild.roles.cache.get(reacJson[emote]["action_args"][i]).name + " to " + user.username);
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

        let reacJson = db.get("reactionactions", reaction.message.channel.id, reaction.message.id);

        for (var emote in reacJson) {
            if (reaction.emoji.toString() === emote) {
                if (reacJson[emote]["action"] === "setrole") {
                    for (var i = 0; i < reacJson[emote]["action_args"].length; i++) {
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(reacJson[emote]["action_args"][i]);
                        console.log("Info  | Discord    : Autorole removed " + reaction.message.guild.roles.cache.get(reacJson[emote]["action_args"][i]).name + " to " + user.username);
                    }
                }
            }
        }
    });
}

module.exports.help = {
    name: "reactionactions"
}