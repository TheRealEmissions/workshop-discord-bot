exports.run = (client, message, args) => {
    client.sql.query(`SELECT * FROM xp WHERE id = '${message.author.id}'`, (err, xpRows) => {
        client.sql.query(`SELECT * FROM process WHERE id = '${message.author.id}'`, (err, processRows) => {
            let profile = new client.modules.Discord.RichEmbed()
                .setTitle(`[${processRows[0].forename}'s Profile]`)
                .setURL(`https://buy.unitedrealm.co.uk/`)
                .setDescription(`From below, please select the option you wish to view.\n \n:one: Personal Profile *(Forename and PayPal Address)*\n:two: User Profile *(XP)*\n:x: Close this message\n \n `)
                .setColor(0x000000)
            message.channel.send(profile).then(async(msg) => {
                await msg.react("1⃣").then(async() => {
                    await msg.react("2⃣").then(async() => {
                        await msg.react("❌");
                    });
                });
                let filter = (reaction, player) => ((reaction.emoji.name === "1⃣") || (reaction.emoji.name === "2⃣") || (reaction.emoji.name === "❌")) && player.id === message.author.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', async reaction => {
                    if (reaction.emoji.name === "1⃣") {
                        reaction.remove(reaction.users.last());
                        let personalProfile = new client.modules.Discord.RichEmbed()
                            .setTitle(`[${processRows[0].forename}'s Profile]`)
                            .setURL(`https://buy.unitedrealm.co.uk/`)
                            .setDescription(`From below, please select the option you wish to view.\n \n:one: **Personal Profile *(Forename and PayPal Address)***\n:two: User Profile *(XP)*\n:x: Close this message\n \n `)
                            .setColor(0x000000)
                            .addField(`Forename`, `${processRows[0].forename}`, true)
                            .addField(`PayPal Address`, `||${processRows[0].ppaddress}||`, true);
                        msg.edit(personalProfile);
                    } else if (reaction.emoji.name === "2⃣") {
                        reaction.remove(reaction.users.last());
                        let xp;
                        if (!xpRows[0]) {
                            xp = `No XP`;
                        } else {
                            xp = xpRows[0].xp;
                        }
                        let userProfile = new client.modules.Discord.RichEmbed()
                            .setTitle(`[${processRows[0].forename}'s Profile]`)
                            .setURL(`https://buy.unitedrealm.co.uk/`)
                            .setDescription(`From below, please select the option you wish to view.\n \n:one: Personal Profile *(Forename and PayPal Address)*\n:two: **User Profile *(XP)***\n:x: Close this message\n \n `)
                            .setColor(0x000000)
                            .addField(`XP`, xp);
                        msg.edit(userProfile);
                    } else if (reaction.emoji.name === "❌") {
                        collector.stop();
                        message.delete();
                        msg.delete();
                    }
                });
            })
        });
    });
}