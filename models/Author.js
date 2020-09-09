const mongoose = require("mongoose");
const moment = require("moment");

let authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: String,
    },
    dob: {
        type: Date,
        get: function (date) {
            return moment(date).format("DD-MM-YYYY");
        },
    },
    address: {
        state: {
            type: String,
            validate: {
                validator: function (state) {
                    return state.length >= 2 && state.length <= 3;
                },
            },
        },
        suburb: String,
        street: String,
        unit: Number,
    },

    numBooks: {
        type: Number,
        validate: {
            validator: function (number) {
                return number >= 1 && number <= 150;
            },
            message: "The author can only have 1 to 150 books",
        },
    },
});

module.exports = mongoose.model("Author", authorSchema);
