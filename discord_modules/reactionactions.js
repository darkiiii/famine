// --- Required modules ---
const db = require('../db.js');

module.exports.run = async (bot) => {
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
                    }
                }
            }
        }
    });
}

module.exports.help = {
    name: "reactionactions"
}