exports.run = (client, message, args) => {
    let roles = ["The Human Assistant", "The Master", "The Retard"];
    if (message.member.roles.some(role => roles.includes(role.name))) {
        client.sql.query(`SELECT chid FROM commissions WHERE chid = '${message.channel.id}'`, (err, rows) => {
            if (err) console.error(err);
            if (rows.length < 1) {
                return;
            } else {
                message.delete();
                let title = new client.modules.Discord.RichEmbed()
                    .setDescription(`What is the title of the project?`)
                message.channel.send(title).then(titleMsg => {
                    let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                        max: 1
                    });
                    collector.on('collect', titleMessage => {
                        titleMsg.delete();
                        titleMessage.delete();
                        let desc = new client.modules.Discord.RichEmbed()
                            .setDescription(`What is the description of the project?`)
                        message.channel.send(desc).then(descMsg => {
                            let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                max: 1
                            });
                            collector.on('collect', descMessage => {
                                descMsg.delete();
                                descMessage.delete();
                                let budget = new client.modules.Discord.RichEmbed()
                                    .setDescription(`What is the budget for this project?`)
                                message.channel.send(budget).then(budgetMsg => {
                                    let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                        max: 1
                                    });
                                    collector.on('collect', prebudgetMessage => {
                                        budgetMsg.delete();
                                        prebudgetMessage.delete();
                                        let budgetMessage = prebudgetMessage.content.toString().replace(/$|£/g, "");
                                        let tf = new client.modules.Discord.RichEmbed()
                                            .setDescription(`What is the time-frame for this project?`)
                                        message.channel.send(tf).then(tfMsg => {
                                            let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                                max: 1
                                            });
                                            collector.on('collect', tfMessage => {
                                                tfMsg.delete();
                                                tfMessage.delete();
                                                let info = new client.modules.Discord.RichEmbed()
                                                    .setDescription(`What is the ID of the information embed message?`)
                                                message.channel.send(info).then(infoMsg => {
                                                    let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                                        max: 1
                                                    });
                                                    collector.on('collect', infoMessage => {
                                                        infoMsg.delete();
                                                        infoMessage.delete();
                                                        let confirm = new client.modules.Discord.RichEmbed()
                                                            .setDescription(`Please review below and :white_check_mark: if all is correct.`)
                                                            .addField(`Title`, titleMessage)
                                                            .addField(`Description`, descMessage)
                                                            .addField(`Budget`, budgetMessage)
                                                            .addField(`Timeframe`, tfMessage)
                                                            .addField(`Info Message ID`, infoMessage)
                                                        message.channel.send(confirm).then(async (confirmMsg) => {
                                                            await confirmMsg.react("✅");
                                                            let filter = (reaction, player) => (reaction.emoji.name == "✅") && player.id == message.author.id;
                                                            let collector = new client.modules.Discord.ReactionCollector(confirmMsg, filter, {});
                                                            collector.on('collect', reaction => {
                                                                message.channel.fetchMessage(infoMessage.toString()).then(msg => {
                                                                    client.sql.query(`UPDATE commissions SET title = '${titleMessage.toString()}', description = '${descMessage.toString()}', budget = '${budgetMessage.toString()}', timeframe = '${tfMessage.toString()}', stage = 'three' WHERE chid = '${message.channel.id}'`);
                                                                    client.sql.query(`SELECT * FROM commissions WHERE chid = '${message.channel.id}'`, (err, rows) => {
                                                                        let info = new client.modules.Discord.RichEmbed()
                                                                            .setTitle(`[Information for **#${message.channel.name}**]`)
                                                                            .setURL(`https://buy.unitedrealm.co.uk/`)
                                                                            .addField(`ID`, message.channel.id, true)
                                                                            .addField(`Stage`, `:${rows[0].stage}:`, true)
                                                                            .addField(`Client`, `<@${rows[0].cid}>`, true)
                                                                            .addField(`Title`, titleMessage.toString(), true)
                                                                            .addField(`Description`, descMessage.toString(), true)
                                                                            .addField(`Budget`, budgetMessage, true)
                                                                            .addField(`Timeframe`, tfMessage, true)
                                                                        msg.edit(info);
                                                                        confirmMsg.delete();
                                                                        client.fetchUser(rows[0].cid).then(user => {
                                                                            let commission = new client.modules.Discord.RichEmbed()
                                                                                .setTitle(`[New commission for ${user.tag}]`)
                                                                                .setURL(`https://buy.unitedrealm.co.uk`)
                                                                                .addField(`ID`, message.channel.id, true)
                                                                                .addField(`Channel`, `<#${message.channel.id}>`, true)
                                                                                .addField(`Title`, titleMessage.toString(), true)
                                                                                .addField(`Description`, descMessage.toString(), true)
                                                                                .addField(`Budget`, budgetMessage, true)
                                                                                .addField(`Timeframe`, tfMessage, true)
                                                                            let commissionCh = message.guild.channels.find(x => x.name === "commissions");
                                                                            let haRole = message.guild.roles.find(x => x.name === "The Human Assistant");
                                                                            commissionCh.send(commission).then(async (commissionMsg) => {
                                                                                let sentCommission = new client.modules.Discord.RichEmbed()
                                                                                    .setTitle(`[The Human Assistant]`)
                                                                                    .setURL(`https://buy.unitedrealm.co.uk/`)
                                                                                    .setDescription(`Our Human Assistant has posted your project to The Master! The Master shall get back to you soon regarding your commission, please keep an eye on this channel!`)
                                                                                    .setColor(haRole.hexColor)
                                                                                message.channel.send(sentCommission).then(async(sentCommissionMsg) => {
                                                                                    message.channel.setParent(`546014817358708786`);
                                                                                    await commissionMsg.react("✅").then(() => {
                                                                                        commissionMsg.react("💰").then(() => {
                                                                                            commissionMsg.react("⏰").then(() => {
                                                                                                commissionMsg.react("❌");
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                    // on commission:
                                                                                    /*

                                                                                    claim ✅
                                                                                    low budget 💰
                                                                                    low timeframe ⏰
                                                                                    reject ❌

                                                                                    */
                                                                                    let filter = (reaction, player) => ((reaction.emoji.name == "✅") || (reaction.emoji.name == "💰") || (reaction.emoji.name == "⏰") || (reaction.emoji.name == "❌")) && player.id == client.settings.important.evalid;
                                                                                    let collector = new client.modules.Discord.ReactionCollector(commissionMsg, filter, {});
                                                                                    collector.on('collect', reaction => {
                                                                                        if (reaction.emoji.name == "✅") {
                                                                                            let claimedCommission = new client.modules.Discord.RichEmbed()
                                                                                                .setTitle(`[The Human Assistant]`)
                                                                                                .setURL(`https://buy.unitedrealm.co.uk`)
                                                                                                .setDescription(`The Master has claimed your commission! Please discuss with The Master further on attributes such as pricing.`)
                                                                                                .setColor(haRole.hexColor);
                                                                                            message.channel.send(`<@${rows[0].cid}>`).then(() => {
                                                                                                message.channel.send(claimedCommission);
                                                                                                sentCommissionMsg.delete();
                                                                                            });
                                                                                            message.channel.setParent(`546014867597950986`);
                                                                                        }
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });

                            });
                        });

                    });
                });
            }
        });
    } else {
        return;
    }
}