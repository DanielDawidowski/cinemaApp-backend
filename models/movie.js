const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const movieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 52
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        price: {
            type: Number,
            required: true,
            maxlength: 30
        },
        movieCategory: {
            type: String,
            default: "Komedia",
            enum: ["Komedia", "Horror", "Romantyczny", "Przygodowy", "Akcja", "Bajka", "Sci-Fi", "Fantastyka"]
        },
        city: {
            type: ObjectId,
            ref: "City",
            required: true
        },
        history: {
            type: Array,
            default: []
        },
        photo: {
            data: Buffer,
            contentType: String
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema); 