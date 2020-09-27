const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const playTimeSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        time: {
            type: String,
            required: true,
            maxlength: 30
        },
        // movie: {
        //     type: ObjectId,
        //     ref: "Movie",
        //     required: true
        // },
        hall: {
            type: ObjectId,
            ref: "Hall",
            required: true
        },
        sold: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("PlayTime", playTimeSchema); 