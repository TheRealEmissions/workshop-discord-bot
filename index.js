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