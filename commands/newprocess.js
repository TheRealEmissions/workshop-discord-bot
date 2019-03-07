exports.run = (client, message, args) => {
    message.delete();
    if (message.content.toString().startsWith(client.settings.basics.botPrefix)) {
        if (client.settings.important.debug == true) {
            let tadebug = message.guild.channels.find(x => x.name === "ta-debug");
            console.log(`Received newprocess command from ${message.author.tag}`);
            console.log(`Args: ${args}`);
            tadebug.send(`Received newprocess command from ${message.author.tag}`);
            tadebug.send(`Args: ${args}`);
        }
        let member = message.guild.member(args[0]);
        client.fetchUser(args[0]).then(user => {
            if (user.id === client.user.id) return;
            message.guild.createChannel(`${user.username}-${user.discriminator}`, 'text').then(async (c) => {
                let everyoneRole = message.guild.roles.find(x => x.name === "@everyone");
                c.setParent(`542103500180684820`);
                c.setTopic(`Process for ${user.tag}`);
                c.overwritePermissions(everyoneRole, {
                    VIEW_CHANNEL: false,
                    SEND_MESSAGES: false
                });
                c.overwritePermissions(user, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    SEND_TTS_MESSAGES: false,
                    EMBED_LINKS: true,
                    ATTACH_FILES: true,
                    READ_MESSAGE_HISTORY: true,
                    MENTION_EVERYONE: false
                });
                let welcome = new client.modules.Discord.RichEmbed()
                    .setTitle(`[Welcome to The Workshop]`)
                    .setURL(`https://buy.unitedrealm.co.uk/`)
                    .setColor(0x42f4d7)
                    .setDescription(`To continue using The Workshop, we require you to run through this process. Please follow the instructions and afterwards you will be verified.`);
                c.send(welcome).then((originalMessage) => {
                    let first = new client.modules.Discord.RichEmbed()
                        .setDescription("`Step 1`" + ` What is your forename?`)
                        .setColor(0x000000);
                    c.send(first).then(firstMsg => {
                        let collector = new client.modules.Discord.MessageCollector(c, m => m.author.id == user.id, {
                            max: 1
                        });
                        if (client.settings.important.debug == true) message.guild.channels.find(x => x.name === "ta-debug").send(collector.toString());
                        collector.on('collect', message1 => {
                            console.log(message1.toString());
                            originalMessage.edit(welcome.addField(`Forename:`, `${message1.toString()}`, true));
                            collector.stop();
                            // input into database
                            message1.delete();
                            firstMsg.delete();
                            let second = new client.modules.Discord.RichEmbed()
                                .setDescription("`Step 2`" + ` What is your PayPal E-Mail address?`)
                                .setColor(0x000000)
                            c.send(second).then(secondMsg => {
                                let collector = new client.modules.Discord.MessageCollector(c, m => m.author.id == user.id, {});
                                if (client.settings.important.debug == true) message.guild.channels.find(x => x.name === "ta-debug").send(collector.toString());
                                collector.on('collect', message2 => {
                                    if (!message2.toString().includes(`@`)) {
                                        let noEmail = new client.modules.Discord.RichEmbed()
                                            .setDescription(`You have provided an incorrect email. An email must look like this: ` + "`example@workshop.com`")
                                            .setColor(0xf90202)
                                        c.send(noEmail).then(msg => {
                                            setTimeout(() => {
                                                msg.delete();
                                            }, 5000);
                                        });
                                        message2.delete();
                                    } else {
                                        collector.stop();
                                        originalMessage.edit(welcome.addField(`PayPal E-Mail address:`, `${message2.toString()}`, true));
                                        // input into database
                                        message2.delete();
                                        secondMsg.delete();
                                        let third = new client.modules.Discord.RichEmbed()
                                            .setDescription("`Step 3`" + ` Do you agree to our [Terms of Service](https://google.co.uk/) for The Workshop?`)
                                            .setColor(0x000000)
                                        c.send(third).then(async (thirdMsg) => {
                                            await thirdMsg.react("✅").then(async () => {
                                                await thirdMsg.react("❌");
                                            });
                                            let filter = (reaction, player) => ((reaction.emoji.name === "✅") || (reaction.emoji.name === "❌")) && player.id === user.id;
                                            let collector = new client.modules.Discord.ReactionCollector(thirdMsg, filter, {});
                                            collector.on('collect', async reaction => {
                                                if (reaction.emoji.name === "❌") {
                                                    collector.stop();
                                                    originalMessage.edit(welcome.addField(`Agreed to TOS?`, `❌`, true));
                                                    let mustTOS = new client.modules.Discord.RichEmbed()
                                                        .setDescription(`To gain access to The Workshop, you must agree to our Terms of Service. You will now be kicked from the Discord. If you wish to join back and agree to our Terms of Service, please do so.`)
                                                        .setColor(0xf90202)
                                                    c.send(mustTOS).then(msg => {
                                                        setTimeout(() => {
                                                            c.delete();
                                                            member.kick();
                                                            // clear from database
                                                        }, 10000);
                                                    });
                                                } else {
                                                    originalMessage.edit(welcome.addField(`Agreed to TOS?`, `✅`, true));
                                                    let verified = new client.modules.Discord.RichEmbed()
                                                        .setTitle(`[Successfully verified]`)
                                                        .setURL(`https://buy.unitedrealm.co.uk`)
                                                        .setColor(0x42f4d7)
                                                        .setDescription(`Thank you for verifying yourself. This process will be closed in **10 seconds**.`)
                                                        .setTimestamp();
                                                    c.send(verified);
                                                    let memberRole = message.guild.roles.find(x => x.name === "Member");
                                                    let welcomeCh = message.guild.channels.find(x => x.name === "welcome");
                                                    let welcomeMsg = new client.modules.Discord.RichEmbed()
                                                        .setColor(0x42f4d7)
                                                        .setDescription(`<@${user.id}> has joined *The Workshop*`)
                                                        .setFooter(`The Workshop now has ${message.guild.roles.find(x => x.name === "Member").members.size} members!`)
                                                        .setTimestamp();
                                                    member.addRole(memberRole).then(() => {
                                                        member.setNickname(`${message1} [${user.username}]`);
                                                        setTimeout(() => {
                                                            c.delete();
                                                            welcomeCh.send(welcomeMsg);
                                                        }, 10000);
                                                    });
                                                    client.sql.query(`SELECT * FROM process WHERE id = '${user.id}'`, (err, rows) => {
                                                        if (err) console.error(err);
                                                        if (client.settings.important.debug == true) console.log(rows);
                                                        let db;
                                                        if (!rows[0]) {
                                                            db = `INSERT INTO process (id, forename, ppaddress) VALUES ('${user.id}', '${message1.toString()}', '${message2.toString()}')`;
                                                        } else {
                                                            db = `UPDATE process SET forename = '${message1.toString()}', ppaddress = '${message2.toString()}' WHERE id = '${user.id}'`;
                                                        }
                                                        client.sql.query(db);
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                        })
                    });
                });
            });
        });
    } else {
        return;
    }
};