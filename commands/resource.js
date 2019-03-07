exports.run = (client, message, args) => {
    // title
    // link
    // desc
    // version
    // channel to post in
    if (!args[0]) {
        let noArgs = new client.modules.Discord.RichEmbed()
            .setDescription(`To use this command, you must specify an argument. The types of arguments you can specify are:\n**Post** *- Post a new resource*\n**Update** - *Post an update for an existing resource*`)
        message.channel.send(noArgs);
    }
    if (args[0] == "post") {
        if ((message.channel.name !== "master_chat")) return;
        let title = new client.modules.Discord.RichEmbed()
            .setDescription(`What is the title of the project?`)
        message.channel.send(title).then(titleMsg => {
            let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                max: 1
            });
            collector.on('collect', titleMessage => {
                if (titleMessage.content.toLowerCase() == "cancel") {
                    client.functions.generalFunctions.cancelCollector(collector, message.channel, titleMsg, titleMessage, message);
                } else {
                    titleMsg.delete();
                    titleMessage.delete();
                    let link = new client.modules.Discord.RichEmbed()
                        .setDescription(`What is the URL of the project?`)
                    message.channel.send(link).then(linkMsg => {
                        let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                            max: 1
                        });
                        collector.on('collect', linkMessage => {
                            if (linkMessage.content.toLowerCase() == "cancel") {
                                client.functions.generalFunctions.cancelCollector(collector, message.channel, linkMsg, linkMessage, message);
                            } else {
                                linkMsg.delete();
                                linkMessage.delete();
                                let desc = new client.modules.Discord.RichEmbed()
                                    .setDescription(`What is the description of the project?`)
                                message.channel.send(desc).then(descMsg => {
                                    let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                        max: 1
                                    });
                                    collector.on('collect', descMessage => {
                                        if (descMessage.content.toLowerCase() == "cancel") {
                                            client.functions.generalFunctions.cancelCollector(collector, message.channel, descMsg, descMessage, message);
                                        } else {
                                            descMsg.delete();
                                            descMessage.delete();
                                            let version = new client.modules.Discord.RichEmbed()
                                                .setDescription(`What is the version of the project?`)
                                            message.channel.send(version).then(versionMsg => {
                                                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                                    max: 1
                                                });
                                                collector.on('collect', versionMessage => {
                                                    if (versionMessage.content.toLowerCase() == "cancel") {
                                                        client.functions.generalFunctions.cancelCollector(collector, message.channel, versionMsg, versionMessage, message);
                                                    } else {
                                                        let image = new client.modules.Discord.RichEmbed()
                                                            .setDescription(`What image should I use for this project? *If there is not an image, please type ` + "`none`" + `.`)
                                                        message.channel.send(image).then(imageMsg => {
                                                            let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                                                max: 1
                                                            });
                                                            collector.on('collect', imageMessage => {
                                                                if (imageMessage.content.toLowerCase() == "cancel") {
                                                                    client.functions.generalFunctions.cancelCollector(collector, message.channel, imageMsg, imageMessage, message);
                                                                } else {
                                                                    imageMsg.delete();
                                                                    imageMessage.delete();
                                                                    let ch = new client.modules.Discord.RichEmbed()
                                                                        .setDescription(`What channel should I post this in? *Please type the name with no #*`)
                                                                    message.channel.send(ch).then(chMsg => {
                                                                        let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                                                                            max: 1
                                                                        });
                                                                        versionMsg.delete();
                                                                        versionMessage.delete();
                                                                        collector.on('collect', chMessage => {
                                                                            if (chMessage.content.toLowerCase() == "cancel") {
                                                                                collector.stop();
                                                                                client.functions.generalFunctions.cancelledCollector(message.channel);
                                                                                chMsg.delete();
                                                                                chMessage.delete();
                                                                                message.delete();
                                                                                return;
                                                                            } else {
                                                                                chMsg.delete();
                                                                                chMessage.delete();
                                                                                let resourcePost = new client.modules.Discord.RichEmbed()
                                                                                    .setTitle(`[${titleMessage.toString()}]`)
                                                                                    .setURL(`${linkMessage}`)
                                                                                    .setDescription(`**${linkMessage}**\n${descMessage}`)
                                                                                    .setFooter(`Version: ${versionMessage}`)
                                                                                    .setColor(0x42f4d7);
                                                                                if (imageMessage.content.toLowerCase() !== "none") {
                                                                                    resourcePost.setImage(`${imageMessage}`);
                                                                                }
                                                                                if (message.guild.channels.some(x => x.name === chMessage.toString())) {
                                                                                    let chPost = message.guild.channels.find(x => x.name === chMessage.toString());
                                                                                    chPost.send(resourcePost);
                                                                                } else {
                                                                                    let filteredMsg = chMessage.toString().toLowerCase().replace(" ", "_");
                                                                                    message.guild.createChannel(filteredMsg, 'text').then(c => {
                                                                                        c.send(resourcePost).then(resourceMsg => {
                                                                                            resourceMsg.pin();
                                                                                        });
                                                                                        c.setParent(`544914959591800842`);
                                                                                    });
                                                                                }
                                                                            }
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });
                }
            });
        });
    } else if (args[0] == "update") {
        if ((message.channel.name !== "master_chat")) return;
        // original message id
        // title
        // normal url
        // url for UPDATE
        // image
        // description
        // update description
        // new version
        // channel to post in
        let origMsgID = new client.modules.Discord.RichEmbed()
            .setDescription(`Please send the ID of the original post message.`)
        message.channel.send(origMsgID).then(origMsgIDMsg => {
            let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                max: 1
            });
            collector.on('collect', origMsgIDMessage => {
                if (origMsgIDMessage.content.toLowerCase() == "cancel") {
                    client.functions.generalFunctions.cancelCollector(collector, message.channel, origMsgIDMsg, origMsgIDMessage, message);
                } else {
                    collector.stop();
                    origMsgIDMsg.delete();
                    origMsgIDMessage.delete();
                    let title = new client.modules.Discord.RichEmbed()
                        .setDescription(`What is the title for this project?`)
                    message.channel.send(title).then(titleMsg => {
                        let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                            max: 1
                        });
                        collector.on('collect', titleMessage => {
                            if (titleMessage.content.toLowerCase() == "cancel") {
                                client.functions.generalFunctions.cancelCollector(collector, message.channel, titleMsg, titleMessage, message);
                            } else {
                                titleMsg.delete();
                                titleMessage.delete();
                                collector.stop();
                                let normalURL = new client.modules.Discord.RichEmbed()
                                    .setDescription(`What is the URL for the project? *Note: this is not the URL for the update*`)
                                message.channel.send(normalURL).then(normalURLMsg => {
                                    let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                                        max: 1
                                    });
                                    collector.on('collect', normalURLMessage => {
                                        if (normalURLMessage.content.toLowerCase() == "cancel") {
                                            client.functions.generalFunctions.cancelCollector(collector, message.channel, normalURLMsg, normalURLMessage, message);
                                        } else {
                                            normalURLMsg.delete();
                                            normalURLMessage.delete();
                                            collector.stop();
                                            let url = new client.modules.Discord.RichEmbed()
                                                .setDescription(`What is the URL for the project update?`)
                                            message.channel.send(url).then(urlMsg => {
                                                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                                                    max: 1
                                                });
                                                collector.on('collect', urlMessage => {
                                                    if (urlMessage.content.toLowerCase() == "cancel") {
                                                        client.functions.generalFunctions.cancelCollector(collector, message.channel, urlMsg, urlMessage, message);
                                                    } else {
                                                        urlMsg.delete();
                                                        urlMessage.delete();
                                                        collector.stop();
                                                        let image = new client.modules.Discord.RichEmbed()
                                                            .setDescription(`What is the link to the image of this project? *If there is no image, please state ` + "`none`" + ".*")
                                                        message.channel.send(image).then(imageMsg => {
                                                            let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                                                                max: 1
                                                            });
                                                            collector.on('collect', imageMessage => {
                                                                if (imageMessage.content.toLowerCase() == "cancel") {
                                                                    client.functions.generalFunctions.cancelCollector(collector, message.channel, imageMsg, imageMessage, message);
                                                                } else {
                                                                    imageMsg.delete();
                                                                    imageMessage.delete();
                                                                    collector.stop();
                                                                    let desc = new client.modules.Discord.RichEmbed()
                                                                        .setDescription(`What is the description for this project? *Note: this is not the description for the update*`)
                                                                    message.channel.send(desc).then(descMsg => {
                                                                        let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                                                                            max: 1
                                                                        });
                                                                        collector.on('collect', descMessage => {
                                                                            if (descMessage.content.toLowerCase() == "cancel") {
                                                                                client.functions.generalFunctions.cancelCollector(collector, message.channel, descMsg, descMessage, message);
                                                                            } else {
                                                                                descMsg.delete();
                                                                                descMessage.delete();
                                                                                collector.stop();
                                                                                let descUpdate = new client.modules.Discord.RichEmbed()
                                                                                    .setDescription(`What is the description for the update?`)
                                                                                message.channel.send(descUpdate).then(descUpdateMsg => {
                                                                                    let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                                                                                        max: 1
                                                                                    });
                                                                                    collector.on('collect', descUpdateMessage => {
                                                                                        if (descUpdateMessage.content.toLowerCase() == "cancel") {
                                                                                            client.functions.generalFunctions.cancelCollector(collector, message.channel, descUpdateMsg, descUpdateMessage, message);
                                                                                        } else {
                                                                                            descUpdateMsg.delete();
                                                                                            descUpdateMessage.delete();
                                                                                            collector.stop();
                                                                                            let version = new client.modules.Discord.RichEmbed()
                                                                                                .setDescription(`What is the version of the update?`)
                                                                                            message.channel.send(version).then(versionMsg => {
                                                                                                let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                                                                                                    max: 1
                                                                                                });
                                                                                                collector.on('collect', versionMessage => {
                                                                                                    if (versionMessage.content.toLowerCase() == "cancel") {
                                                                                                        client.functions.generalFunctions.cancelCollector(collector, message.channel, versionMsg, versionMessage, message);
                                                                                                    } else {
                                                                                                        versionMsg.delete();
                                                                                                        versionMessage.delete();
                                                                                                        collector.stop();
                                                                                                        let ch = new client.modules.Discord.RichEmbed()
                                                                                                            .setDescription(`What channel should I post this update in? *Please state the channel name without the #*`)
                                                                                                        message.channel.send(ch).then(chMsg => {
                                                                                                            let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                                                                                                                max: 5
                                                                                                            });
                                                                                                            collector.on('collect', chMessage => {
                                                                                                                if (chMessage.content.toLowerCase() == "cancel") {
                                                                                                                    client.functions.generalFunctions.cancelCollector(collector, message.channel, chMsg, chMessage, message);
                                                                                                                } else {
                                                                                                                    chMessage.delete();
                                                                                                                    if (message.guild.channels.some(x => x.name === chMessage.toString())) {
                                                                                                                        collector.stop();
                                                                                                                        let ch = message.guild.channels.find(x => x.name === chMessage.toString());
                                                                                                                        let chUpdateEmbed = new client.modules.Discord.RichEmbed()
                                                                                                                            .setTitle(`[${titleMessage}]`)
                                                                                                                            .setFooter(`Updated to version: ${versionMessage}`)
                                                                                                                            .setColor(0x24e00f)
                                                                                                                            .setURL(`${urlMessage}`)
                                                                                                                            .setDescription(`**${urlMessage}**\n${descUpdateMessage}`)
                                                                                                                            .setTimestamp();
                                                                                                                        let chEmbed = new client.modules.Discord.RichEmbed()
                                                                                                                            .setTitle(`[${titleMessage}]`)
                                                                                                                            .setFooter(`Version: ${versionMessage}`)
                                                                                                                            .setColor(0x42f4d7)
                                                                                                                            .setURL(`${normalURLMessage}`)
                                                                                                                            .setDescription(`**${normalURLMessage}**\n${descMessage}`)
                                                                                                                        if (imageMessage.content.toLowerCase() !== "none") {
                                                                                                                            chEmbed.setImage(`${imageMessage}`);
                                                                                                                        }
                                                                                                                        ch.send(chUpdateEmbed);
                                                                                                                        ch.fetchMessage(origMsgIDMessage.toString()).then(msg => {
                                                                                                                            msg.edit(chEmbed);
                                                                                                                        });
                                                                                                                    }
                                                                                                                }
                                                                                                            });
                                                                                                        });
                                                                                                    }
                                                                                                });
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                });
                                                                            }
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });
                }
            });
        });
    } else if (args[0] == "delete") {
        if ((message.channel.name !== "master_chat")) return;
        // get channel
        // confirm
        let channelEmbed = new client.modules.Discord.RichEmbed()
            .setDescription(`What is the name of the channel of the resource you would like to delete? *Please state the channel name without the #*`)
        message.channel.send(channelEmbed).then(channelMsg => {
            let collector = new client.modules.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {});
            collector.on('collect', async channelMessage => {
                let filteredMsg = channelMessage.toString().replace(" ", "_");
                if (message.guild.channels.some(x => x.name === filteredMsg.toString())) {
                    channelMsg.delete();
                    channelMessage.delete();
                    let ch = message.guild.channels.find(x => x.name === filteredMsg.toString());
                    let confirm = new client.modules.Discord.RichEmbed()
                        .setDescription(`Are you sure you want to delete ${ch.name}?`)
                    message.channel.send(confirm).then(confirmMsg => {
                        confirmMsg.react("✅").then(() => {
                            confirmMsg.react("❌");
                        });
                        let filter = (reaction, player) => ((reaction.emoji.name == "❌") || (reaction.emoji.name == "✅")) && player.id == message.author.id;
                        let collector = new client.modules.Discord.ReactionCollector(confirmMsg, filter, {});
                        collector.on('collect', async reaction => {
                            confirmMsg.delete();
                            if (reaction.emoji.name == "✅") {
                                ch.delete();
                                let deleted = new client.modules.Discord.RichEmbed()
                                    .setDescription(`Successfully deleted ${ch.name}.`);
                                message.channel.send(deleted);
                            } else if (reaction.emoji.name == "❌") {
                                let cancel = new client.modules.Discord.RichEmbed()
                                    .setDescription(`Cancelled deletion process of ${ch.name}.`)
                                message.channel.send(cancel);
                                collector.stop();
                                return;
                            }
                        });
                    });
                } else {
                    if (channelMessage == "cancel") {
                        collector.stop();
                        message.channel.send(`Cancelled.`)
                    } else {
                        let channelNotFound = new client.modules.Discord.RichEmbed()
                            .setDescription(`This channel cannot be found!`)
                            .setColor(0x9C0A0A)
                        message.channel.send(channelNotFound);
                    }
                }
            });
        });
    }
}