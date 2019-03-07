// COLOUR = 0x42f4d7

/*
CONSTANTS
*/

const modules = {
    Discord: require("discord.js"),
    fs: require("fs"),
    Enmap: require("enmap"),
    mongoose: require("mongoose")
};
const dbSchemas = {
    process: new modules.mongoose.Schema({
        id: Number,
        forename: String,
        ppaddress: String
    }),
    commissions: new modules.mongoose.Schema({
        ids: {
            client: Number,
            channel: Number
        },
        commissionInfo: {
            title: String,
            description: String,
            budget: Number,
            timeframe: String
        },
        channelInfo: {
            stage: String,
        },
        paymentInfo: {
            pplink: String,
            cost: String
        }
    }),
    userProfile: new modules.mongoose.Schema({
        id: Number,
        xp: {
            amount: Number
        }
    })
}
const schemas = {
    process: modules.mongoose.model('process', dbSchemas.process),
    commissions: modules.mongoose.model('commissions', dbSchemas.commissions),
    userProfile: modules.mongoose.model('userProfile', dbSchemas.userProfile)
}
const clientOptions = {
    disableEveryone: false,
    apiRequestMethod: "sequential",
    disabledEvents: ["TYPING_START"]
};
const client = new modules.Discord.Client(clientOptions);
const settings = {
    auth: require(`./settings/auth.json`),
    basics: require(`./settings/basics.json`),
    important: require(`./settings/important.json`)
};

/*
HANDLERS
*/

client.commands = new modules.Enmap();

modules.fs.readdir("./commands/", (err, files) => {
    if (err) {
        console.error(err);
    }
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`[DEBUG] Loading command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

modules.fs.readdir("./events/", (err, files) => {
    if (err) {
        console.error(err);
    }
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
        console.log(`[DEBUG] Loading event ${file}`);
    });
});


/*
DB CONNECTIONS
*/

/*
FUNCTIONS
*/

const generalFunctions = {
    clean: function clean(text) {
        if (typeof (text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    },
    cancelCollector: function cancelCollector(collector, channel, msg, imsg, message) {
        collector.stop();
        // function cancelCollector(collector, channel, msg, imsg, message)
        let cancelled = new client.modules.Discord.RichEmbed()
            .setDescription(`This process has been cancelled.`)
        channel.send(cancelled).then(msg => {
            setTimeout(() => {
                msg.delete();
            }, 5000);
        });
        msg.delete();
        imsg.delete();
        message.delete();
        return;
    },
    evaluate: function evaluate(message, args) {
        if (message.author.id !== client.settings.important.evalid) {
            return;
        }
        try {
            let code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            message.channel.send(client.functions.generalFunctions.clean(evaled), {
                code: "x1"
            });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${client.functions.generalFunctions.clean(err)}\n\`\`\``);
        }
    }
}
const xpFunctions = {
    genXP: function genXP() {
        let min = 1;
        let max = 30;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

/*
CLIENT
*/

client.modules = modules;
client.settings = settings;
client.functions = {
    generalFunctions: generalFunctions,
    xpFunctions: xpFunctions
}
client.dbSchemas = schemas;

/*
LOGIN
*/

client.login(settings.auth.token);
