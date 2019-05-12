const mongoose = require(`mongoose`);

const userProfiles = new mongoose.Schema({
    user_id: String,
    user_xp: Number
});

module.exports = mongoose.model(`userProfiles`, userProfiles);