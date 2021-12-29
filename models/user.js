const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    handle: {
        type: String,
        required: true
    },
    deposits: {
        type: Number
    },
    state2020: {
        type: Number
    },
    currentState: {
        type: Number
    },
    roiOverall: {
        type: Number
    },
    roi2022: {
        type: Number
    },
    whitdrawals: {
        type: Number
    },
    share: {
        type: Number
    },
    code: {
        type: String
    }
})

// MonthSchema.plugin(AutoIncrement, {inc_field: 'compId'});
const User = mongoose.model('User', UserSchema);

module.exports = User;