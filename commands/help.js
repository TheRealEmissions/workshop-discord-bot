exports.run = (client, message, args) => {
    client.sql.query(`SELECT * FROM process WHERE id = '${message.author.id}'`, (err, rows) => {
        if (err) console.error(err);
        let managementRole = message.guild.roles.find(x => x.name === "The Master");
        let retardRole = message.guild.roles.find(x => x.name === "The Retard");
        let haRole = message.guild.roles.find(x => x.name === "The Human Assistant");
        let memberRole = message.guild.roles.find(x => x.name === "Member");
        if ((message.member.roles.has(managementRole.id)) || (message.member.roles.has(retardRole.id))) {
            let helpMenu = new client.modules.Discord.RichEmbed()
                .setTitle(`[${rows[0].forename}'s Help Menu]`)
                .setURL(`https://buy.unitedrealm.co.uk`)
                .setDescription(`:one: Master Commands\n:two: Resource Commands\n:three: Profile Commands`)
                .setColor(0x42f4d7);
            message.channel.send(helpMenu).then(msg => {
                msg.react("1⃣").then(() => {
                    msg.react("2⃣").then(() => {
                        msg.react("3⃣").then(() => {
                            msg.react("❌");
                        });
                    });
                });
                let filter = (reaction, player) => ((reaction.emoji.name === "1⃣") || (reaction.emoji.name === "2⃣") || (reaction.emoji.name === "3⃣") || (reaction.emoji.name === "❌")) && player.id == message.author.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', async reaction => {
                    if (reaction.emoji.name === "❌") {
                        msg.delete();
                        message.delete();
                    }
                    if (reaction.emoji.name === "1⃣") {
                        reaction.remove(reaction.users.last());
                        let helpMenu = new client.modules.Discord.RichEmbed()
                            .setTitle(`[${rows[0].forename}'s Help Menu]`)
                            .setURL(`https://buy.unitedrealm.co.uk`)
                            .setDescription(`:one: **Master Commands**\n:two: Resource Commands\n:three: Profile Commands`)
                            .setColor(0x42f4d7)
                            .addField(`<{:botcommand:}>newprocess <id>`, `Run a new process for a user`)
                            .addField(`-eval <code>`, `Evaluate code using the bot`);
                        msg.edit(helpMenu);
                    }
                    if (reaction.emoji.name === "2⃣") {
                        reaction.remove(reaction.users.last());
                        let helpMenu = new client.modules.Discord.RichEmbed()
                            .setTitle(`[${rows[0].forename}'s Help Menu]`)
                            .setURL(`https://buy.unitedrealm.co.uk`)
                            .setDescription(`:one: Master Commands\n:two: **Resource Commands**\n:three: Profile Commands`)
                            .setColor(0x42f4d7)
                            .addField(`-resource`, `View the arguments for the resource command`, true)
                            .addField(`-resource post`, `Post a new resource`, true)
                            .addField(`-resource update`, `Update an existing resource`, true)
                            .addField(`-resource delete`, `Delete a resource`)
                        msg.edit(helpMenu);
                    }
                    if (reaction.emoji.name === "3⃣") {
                        reaction.remove(reaction.users.last());
                        let helpMenu = new client.modules.Discord.RichEmbed()
                            .setTitle(`[${rows[0].forename}'s Help Menu]`)
                            .setURL(`https://buy.unitedrealm.co.uk`)
                            .setDescription(`:one: Master Commands\n:two: Resource Commands\n:three: **Profile Commands**`)
                            .setColor(0x42f4d7)
                            .addField(`-profile`, `View your profile`, true)
                        msg.edit(helpMenu);
                    }
                });
            });
        } else if (message.member.roles.has(haRole.id)) {
            let helpMenu = new client.modules.Discord.RichEmbed()
                .setTitle(`[${rows[0].forename}'s Help Menu]`)
                .setURL(`https://buy.unitedrealm.co.uk`)
                .setDescription(`:one: Resource Commands\n:two: Profile Commands`)
                .setColor(0x42f4d7);
            message.channel.send(helpMenu).then(msg => {
                msg.react("1⃣").then(() => {
                    msg.react("2⃣").then(() => {
                        msg.react("❌");
                    });
                });
                let filter = (reaction, player) => ((reaction.emoji.name == "1⃣") || (reaction.emoji.name == "2⃣") || (reaction.emoji.name == "❌")) && player.id == message.author.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', async reaction => {
                    if (reaction.emoji.name == "❌") {
                        message.delete();
                        msg.delete();
                    }
                    if (reaction.emoji.name == "1⃣") {
                        reaction.remove(reaction.users.last());
                        let helpMenu = new client.modules.Discord.RichEmbed()
                            .setTitle(`[${rows[0].forename}'s Help Menu]`)
                            .setURL(`https://buy.unitedrealm.co.uk`)
                            .setDescription(`:one: **Resource Commands**\n:two: Profile Commands`)
                            .setColor(0x42f4d7)
                            .addField(`-resource`, `View the arguments for the resource command`, true)
                            .addField(`-resource update`, `Update an existing resource`, true);
                        msg.edit(helpMenu);
                    }
                    if (reaction.emoji.name == "2⃣") {
                        reaction.remove(reaction.users.last());
                        let helpMenu = new client.modules.Discord.RichEmbed()
                            .setTitle(`[${rows[0].forename}'s Help Menu]`)
                            .setURL(`https://buy.unitedrealm.co.uk`)
                            .setDescription(`:one: Resource Commands\n:two: **Profile Commands**`)
                            .setColor(0x42f4d7)
                            .addField(`-profile`, `View your profile`, true);
                        msg.edit(helpMenu);
                    }
                });
            });
        } else if (message.member.roles.has(memberRole.id)) {
            let helpMenu = new client.modules.Discord.RichEmbed()
                .setTitle(`[${rows[0].forename}'s Help Menu]`)
                .setURL(`https://buy.unitedrealm.co.uk`)
                .setDescription(`:one: Profile Commands`)
                .setColor(0x42f4d7);
            message.channel.send(helpMenu).then(msg => {
                msg.react("1⃣").then(() => {
                    msg.react("❌");
                });
                let filter = (reaction, player) => ((reaction.emoji.name == "❌") || (reaction.emoji.name == "1⃣")) && player.id == message.author.id;
                let collector = new client.modules.Discord.ReactionCollector(msg, filter, {});
                collector.on('collect', async reaction => {
                    if (reaction.emoji.name == "1⃣") {
                        reaction.remove(reaction.users.last());
                        let helpMenu = new client.modules.Discord.RichEmbed()
                            .setTitle(`[${rows[0].forename}'s Help Menu]`)
                            .setURL(`https://buy.unitedrealm.co.uk`)
                            .setDescription(`:one: **Profile Commands**`)
                            .setColor(0x42f4d7)
                            .addField(`-profile`, `View your profile`);
                        msg.edit(helpMenu);
                    }
                    if (reaction.emoji.name == "❌") {
                        msg.delete();
                        message.delete();
                    }
                });
            });
        }
    });
}