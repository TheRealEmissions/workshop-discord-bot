const mongoose = require(`mongoose`);

const process = new mongoose.Schema({
    id: String,
    forename: String,
    ppaddress: String
});

module.exports = mongoose.model(`process`, process);