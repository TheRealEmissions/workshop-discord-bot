const mongoose = require(`mongoose`);

const userProfiles = new mongoose.Schema({
    user_id: String,
    user_xp: Number,
    user_level: Number,
    user_coins: Number
});

module.exports = mongoose.model(`userProfiles`, userProfiles);