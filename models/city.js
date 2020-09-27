const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;


const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        halls: {
            type: Array,
            default: []
        },
        movies: {
            type: Array,
            default: []
        }
    }, 
    { timestamps: true }
)
module.exports = mongoose.model("City", citySchema);

