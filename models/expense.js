const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseShema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String

    },
    images: {
        type: String

    },
    expense: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('expense', expenseShema);