const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const BetSchema = new mongoose.Schema({
    betId: {
        type: Number
    },
    day: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    sport: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true
    },
    pick: {
        type: String,
        required: true
    },
    odds: {
        type: String,
        required: true
    },
    stake: {
        type: String,
        required: true
    },
    result: {
        type: String
    }
})

BetSchema.plugin(AutoIncrement, {inc_field: 'compId'});
const Bet = mongoose.model('Bet', BetSchema);

module.exports = Bet;