module.exports = (client, member) => {
    // create new database for user ID
    let tempCh = member.guild.channels.find(x => x.name === "master_chat");
    tempCh.send(`<{:botcommand:}>newprocess ${member.id}`);
}