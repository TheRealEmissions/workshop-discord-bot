const modules = {
    Discord: require(`discord.js`),
    fs: require(`fs`),
    mongoose: require(`mongoose`),
    ms: require(`ms`),
    randomString: require(`crypto-random-string`)
};
const clientOptions = {
    disableEveryone: false,
    shardCount: 1,
    totalShardCount: 1,
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    fetchAllMembers: false,
    restWsBridgeTimeout: 5000,
    restTimeOffset: 500,
    restSweepInterval: 60,
    retryLimit: 2,
    disabledEvents: ["TYPING_START"]
};
const client = new modules.Discord.Client(clientOptions);
const settings = {
    auth: require(`./settings/auth.json`),
    config: require(`./settings/config.json`)
}
const dbModels = {
    process: require(`./models/process.js`),
    commissions: require(`./models/commissions.js`),
    userProfiles: require(`./models/userProfiles.js`)
}
const functions = {
    saveDB: require(`./functions/saveDB.js`),
    chance: require(`./functions/chance.js`)
}

/*
DATABASE
*/

modules.mongoose.connect(settings.config.database.url, {
    useNewUrlParser: true
});

/*
HANDLERS
*/

modules.fs.readdir(`./events/`, (err, files) => {
    if (err) return console.error(err);
    if (!files) {
        return;
    } else {
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            let event = require(`./events/${file}`);
            let eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client));
            delete require.cache[require.resolve(`./events/${file}`)];
            console.log(`Loaded event ${file}`);
        });
    }
});

const {
    CommandHandler
} = require(`djs-commands`);
let cmdHandler = new CommandHandler({
    folder: __dirname + `/commands/`,
    prefix: [settings.config.prefix]
});

/*
BINDINGS
*/

client.modules = modules;
client.clientOptions = clientOptions;
client.settings = settings;
client.commandHandler = cmdHandler;
client.dbModels = dbModels;
client.functions = functions;

/*
LOGIN
*/

client.login(settings.auth.token);