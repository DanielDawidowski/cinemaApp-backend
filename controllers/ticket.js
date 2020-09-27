const Ticket= require("../models/ticket");
const PlayTime = require('../models/playTime');
const { errorHandler } = require("../helpers/dbErrorHandler");


exports.ticketById = (req, res, next, id) => {
    Ticket.findById(id)
        .populate("movies.movie", "name price")
        .exec((err, ticket) => {
            if (err || !ticket) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.ticket = ticket;
            next();
        });
};

exports.createTicket = (req, res) => {
    // req.body.order.user = req.profile;
    const ticket = new Ticket(req.body.ticket);
    ticket.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};

exports.listTickets = (req, res) => {
    Ticket.find()
        .sort("-created")
        .exec((err, tickets) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(tickets);
        });
};

exports.readTicket = (req, res) => {
    Ticket.find({ movie: req.movie._id }).populate("playTime", "_id").exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(order);
        }
    );
};

exports.addTicketToPlayTimeHistory = (req, res, next) => {
    let history = [];

    history.push(req.body.ticket.seats)
        
    PlayTime.findOneAndUpdate(
        {_id: req.playTime._id },
        { $push: { sold: history } },
        { new: true },
        (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: "Could not update user purchase history"
                });
            }
            next();
        }
    );
};