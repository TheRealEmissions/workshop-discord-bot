module.exports = (client, message) => {
    if (message.channel.type !== "text") return;
    if (message.content.toString().startsWith(client.settings.basics.prefix)) {
        let args = message.content.slice(client.settings.basics.prefix.length).trim().split(" ");
        let command = args.shift().toLowerCase();
        let cmd2 = client.commands.get(command);
        if (client.settings.important.debug == true) {
            let talog = message.guild.channels.find(x => x.name === "ta-debug");
            console.log(`Received message from ${message.author.tag}: ${message.content} //`);
            console.log(`Args: ${args.toString()}`);
            console.log(`Command: ${command.toString()}`);
            talog.send(`Received message from ${message.author.tag}: ${message.content} //`);
            talog.send(`Args: ${args.toString()}`);
            talog.send(`Command: ${command.toString()}`);
        }
        if (!cmd2) return;
        cmd2.run(client, message, args);
    } else if (message.content.toString().startsWith(client.settings.basics.botPrefix)) {
        let args = message.content.slice(client.settings.basics.botPrefix.length).trim().split(" ");
        let command = args.shift().toLowerCase();
        let cmd1 = client.commands.get(command);
        if (client.settings.important.debug == true) {
            let talog = message.guild.channels.find(x => x.name === "ta-debug");
            console.log(`Received message from ${message.author.tag}: ${message.content} //`);
            console.log(`Args: ${args.toString()}`);
            console.log(`Command: ${command.toString()}`);
            talog.send(`Received message from ${message.author.tag}: ${message.content} //`);
            talog.send(`Args: ${args.toString()}`);
            talog.send(`Command: ${command.toString()}`);
        }
        if (!cmd1) return;
        cmd1.run(client, message, args);
    } else {
        client.sql.query(`SELECT * FROM xp WHERE id = '${message.author.id}'`, (err, rows) => {
            if (err) console.error(err);
            if (client.settings.important.debug == true) console.log(rows);
            let db;
            if (rows.length < 1) {
                db = `INSERT INTO xp (id, xp) VALUES ('${message.author.id}', '${client.functions.xpFunctions.genXP()}')`
            } else {
                let xp = rows[0].xp;
                db = `UPDATE xp SET xp = ${xp + client.functions.xpFunctions.genXP()} WHERE id = '${message.author.id}'`;
            }
            client.sql.query(db);
        });
    }
};