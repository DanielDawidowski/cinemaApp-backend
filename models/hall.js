const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const hallSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 100,
        },
        // city: {
        //     type: ObjectId,
        //     ref: "City",
        //     required: true
        // },
        totalSeats: {
            type: Array,
            trim: true,
            required: true,
        },
        rows: {
            type: Number,
            trim: true,
            required: true,
        },
        totalSeatsInRow: {
            type: Number,
            trim: true,
            required: true,
        },       
    },
    { timestamps: true }
)
module.exports = mongoose.model("Hall", hallSchema);
