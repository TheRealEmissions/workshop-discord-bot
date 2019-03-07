exports.run = (client, message, args) => {
    let startTime = new Date().getTime();
    let openingTicket = new client.modules.Discord.RichEmbed()
        .setDescription(`Processing your ticket...`)
        .setColor(0x42f4d7)
    message.channel.send(openingTicket).then(openingTicketMsg => {
        if (message.author.id === client.user.id) return;
        message.guild.createChannel(`${message.author.username}-${message.author.discriminator}`, 'text').then(async (c) => {
            c.setParent(`546014796957483008`);
            let everyoneRole = message.guild.roles.find(x => x.name === "@everyone");
            let haRole = message.guild.roles.find(x => x.name === "The Human Assistant");
            c.overwritePermissions(everyoneRole, {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false
            });
            c.overwritePermissions(haRole, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                SEND_TTS_MESSAGES: false,
                EMBED_LINKS: true,
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false
            });
            c.overwritePermissions(message.author, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                SEND_TTS_MESSAGES: false,
                EMBED_LINKS: true,
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                MENTION_EVERYONE: false
            });
            // cid = client id
            // chid = channel id
            // stages:
            /*
            WIZARD
            COMPLETED WIZARD
            CLAIMED
            IN PROGRESS
            COMPLETED
            CLOSED
            */
            client.sql.query(`INSERT INTO commissions (cid, chid, stage) VALUES ('${message.author.id}', '${c.id}', 'one')`);
            client.sql.query(`SELECT * FROM commissions WHERE chid = '${c.id}'`, (err, s1Rows) => {
                let infoEmbed = new client.modules.Discord.RichEmbed()
                    .setTitle(`[Information for **#${c.name}**]`)
                    .setURL(`https://buy.unitedrealm.co.uk/`)
                    .addField(`ID`, `${c.id}`, true)
                    .addField(`Stage`, `:${s1Rows[0].stage}:`, true)
                    .addField(`Client`, `${message.author}`, true)
                c.send(infoEmbed).then(infoMsg => {
                    let openTime = new Date().getTime();
                    let openedTicket = new client.modules.Discord.RichEmbed()
                        .setDescription(`Processed your ticket! <#${c.id}>`)
                        .setColor(0x04f40c)
                        .setFooter(`Ticket processed in ${(openTime - startTime)/1000} seconds`)
                    openingTicketMsg.edit(openedTicket);
                    /*

                    WIZARD:

                    Title
                    Description
                    Budget
                    Timeframe

                    */

                    //    ⃣
                    let selection = new client.modules.Discord.RichEmbed()
                        .setTitle(`[The Selection]`)
                        .setURL(`https://buy.unitedrealm.co.uk/`)
                        .addField(`:one: The Wizard`, 'Use our articulate automated system to, in beautified fashion, process your order.')
                        .addField(`:two: The Human Assistant`, 'Not a fan of feelingless automation systems? Speak to our handy Human Assistant to process your order.')
                        .setColor(0x000000)
                    c.send(selection).then(async (selectionMsg) => {
                        await selectionMsg.react("1⃣").then(() => {
                            selectionMsg.react("2⃣");
                        });
                        let filter = (reaction, user) => ((reaction.emoji.name == "1⃣") || (reaction.emoji.name == "2⃣")) && user.id == message.author.id;
                        let rCollector = new client.modules.Discord.ReactionCollector(selectionMsg, filter, {});
                        rCollector.on('collect', reaction => {
                            if (reaction.emoji.name == "1⃣") {
                                rCollector.stop();
                                let embedTitle = new client.modules.Discord.RichEmbed()
                                    .setTitle(`[The Wizard]`)
                                let embedDesc = new client.modules.Discord.RichEmbed()
                                let embedBudget = new client.modules.Discord.RichEmbed()
                                let embedTF = new client.modules.Discord.RichEmbed()
                            } else if (reaction.emoji.name == "2⃣") {
                                rCollector.stop();
                                let HArole = message.guild.roles.find(x => x.name === "The Human Assistant");
                                let embedHA = new client.modules.Discord.RichEmbed()
                                    .setTitle(`[The Human Assistant]`)
                                    .setURL(`https://buy.unitedrealm.co.uk/`)
                                    .setDescription(`We have notified our Human Assistant of your request, please be patient while our Human Assistant reviews this ticket. While you wait, please provide these details:\n` + "```" + `Title:\nDescription:\nBudget:\nTimeframe:` + "```")
                                    .setColor(HArole.hexColor)
                                c.send(`<@&544952954264879147>`).then(msg => {
                                    client.sql.query(`UPDATE commissions SET stage = 'two' WHERE chid = '${c.id}'`);
                                    client.sql.query(`SELECT * FROM commissions WHERE chid = '${c.id}'`, (err, s2Rows) => {
                                        let s2Info = new client.modules.Discord.RichEmbed()
                                            .setTitle(`[Information for **#${c.name}**]`)
                                            .setURL(`https://buy.unitedrealm.co.uk/`)
                                            .addField(`ID`, `${c.id}`, true)
                                            .addField(`Stage`, `:${s2Rows[0].stage}:`, true)
                                            .addField(`Client`, `${message.author}`, true)
                                        setTimeout(() => {
                                            msg.delete();
                                            selectionMsg.delete();
                                            infoMsg.edit(s2Info);
                                        }, 10);
                                        c.send(embedHA);
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
}