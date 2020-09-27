const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

// const PlayItemSchema = new mongoose.Schema(
//     {
//         playTime: { type: ObjectId, ref: "PlayTime" },
//         name: String,
//         price: Number,
//     },
//     { timestamps: true }
// );

// const PlayItem = mongoose.model("PlayItem", PlayItemSchema);



const TicketSchema = new mongoose.Schema(
    {
        playTime: { type: ObjectId, ref: "PlayTime" },
        movie: { type: ObjectId, ref: "Movie" },
        amount: Number,
        seats: Array,      
        time: String,
        name: String,
    },
    { timestamps: true }
);

// const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = mongoose.model("Ticket", TicketSchema);

// module.exports = { Ticket, PlayItem };