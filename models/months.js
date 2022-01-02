const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const MonthSchema = new mongoose.Schema({
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    ok: {
        type: String,
        required: true
    },
   ko: {
        type: String,
        required: true
    },
    void: {
        type: String,
        required: true
    },
    stakes: {
        type: String,
        required: true
    },
    profit: {
        type: String,
        required: true
    },
    yield: {
        type: String
    }
})

// MonthSchema.plugin(AutoIncrement, {inc_field: 'compId'});
const Month = mongoose.model('Month', MonthSchema);

module.exports = Month;