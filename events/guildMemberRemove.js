module.exports = (client, member) => {
    if (member.guild.channels.some(x => x.name === `${member.user.username}-${member.user.discriminator}`)) {
        let channel = member.guild.channels.find(x => x.name === `${member.user.username}-${member.user.discriminator}`);
        channel.delete();
    } else {
        return;
    }
    client.sql.query(`DELETE FROM process WHERE id = '${member.id}'`);
}