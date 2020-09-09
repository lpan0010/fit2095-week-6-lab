const mongoose = require("mongoose");
const moment = require("moment");

let bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
    },
    isbn: {
        type: String,
        validate: {
            validator: function (isbn) {
                return isbn.length === 13;
            },
            message: "The ISBN needs to be 13 digits",
        },
    },

    date: {
        type: Date,
        default: Date.now,
        get: function (date) {
            return moment(date).format("DD-MM-YYYY");
        },
    },
    summary: { type: String },
});
module.exports = mongoose.model("Book", bookSchema);
