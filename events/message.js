module.exports = (client, message) => {
    if (message.channel.type !== "text") return;
    if (message.author.id == client.user.id) {

    } else {
        client.dbModels.userProfiles.findOne({
            user_id: message.author.id
        }, (err, db) => {
            if (err) console.error(err);
            if (!db) {
                let newDB = new client.dbModels.userProfiles({
                    user_id: message.author.id,
                    user_xp: 0,
                    user_level: 1,
                    user_coins: 0
                });
                client.functions.saveDB(newDB);
            }
            if (message.content.toString().startsWith(client.settings.config.prefix)) {
                let args = message.content.split(" ");
                let command = args[0];
                let cmd = client.commandHandler.getCommand(command);
                if (!cmd) return;
                try {
                    cmd.run(client, message, args);
                } catch (err) {
                    console.error(err);
                }
            } else {
                // adding XP
                let xpToAdd = client.functions.randomInt(1, 20);
                db.user_xp = parseInt(db.user_xp) + xpToAdd;
                // checking level
                if (parseInt(db.user_xp) >= parseInt(db.user_level) * 1000) {
                    db.user_level = parseInt(db.user_level) + 1;
                    let xpGained = parseInt(db.user_level) * 1000;
                    let embed = new client.modules.Discord.MessageEmbed()
                        .setDescription(`<@${message.author.id}>! You have reached **${xpGained} XP** and have ascended to **Level ${parseInt(db.user_level) + 1}**`)
                        .setColor(0x0ebbb8)
                    message.channel.send(embed).then((msg) => {
                        setTimeout(() => {
                            msg.delete();
                        }, 10000);
                    });
                }
            }
            client.functions.saveDB(db);
        });
    }
}