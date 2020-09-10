const mongoose = require("mongoose");
const moment = require("moment");

let authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            validate: {
                validator: function (name) {
                    return name.length > 5;
                },
                message: "The last name should be greater than 5 characters",
            },
        },
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
                message: "The state needs to be 2-3 letters long",
            },
        },
        suburb: {
            type: String,
            get: function (suburb) {
                return suburb.charAt(0).toUpperCase() + suburb.slice(1);
            },
        },
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
