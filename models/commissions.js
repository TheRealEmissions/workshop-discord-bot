const mongoose = require(`mongoose`);

const commissions = new mongoose.Schema({
    id_client: String,
    id_channel: String,
    commission_title: String,
    commission_description: String,
    commission_budget: Number,
    commission_timeframe: String,
    channel_stage: String,
    payment_pplink: String,
    payment_cost: String
});

module.exports = mongoose.model(`commissions`, commissions);