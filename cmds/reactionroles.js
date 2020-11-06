// --- Required modules ---
const db = require('../db.js');

module.exports.run = async (bot, message, args) => {
    if (!args[3]) {
        msg = await message.channel.send("Le nombre d'arguments est invalide (min: 4)");
        msg.delete({timeout:5000});
        return;
    }
    await message.channel.messages.fetch(args[0]).then(Rmsg => {
        Rmsg.react(args[1]);
        let args_f = args.filter(function (value, index, arr) { return value != ""; });

        reactJson = db.get("reactionroles", Rmsg.channel.id, Rmsg.id);
        if (reactJson === false) {
            reactJson = JSON.parse(db.resolve("{\"" + args_f[1].toString() + "\": {\"action\": \"" + args_f[2].toString() + "\",\"action_args\": [\"" + args_f.slice(3).join("\",\"").toString() + "\"]}}"));
        } else {
            reactJson[args_f[1].toString()] = JSON.parse(db.resolve("{\"action\": \"" + args_f[2].toString() + "\",\"action_args\": [\"" + args_f.slice(3).join("\",\"").toString() + "\"]}"));
        }
        db.set("reactionroles", Rmsg.channel.id, Rmsg.id, reactJson);
    }).catch(err => {
        message.channel.send("Le bot a rencontre une erreur : ```" + err + "```");
        console.log(err);
    });
}

module.exports.help = {
    name: "reactionroles"
}
