const PlayTime = require('../models/playTime');
const Ticket= require("../models/ticket");
const Movie= require("../models/movie");

const formidable = require('formidable')
const _ = require("lodash")
const fs = require('fs')
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.playTimeById = (req, res, next, id) => {
    PlayTime.findById(id).populate('movie', '_id name price').populate('hall', '_id name totalSeats').populate('city', '_id name').exec((err, playTime) => {
        if (err || !playTime) {
            return res.status(400).json({
                error: 'Movie not found'
            });
        }
        req.playTime = playTime;
        next();
    })
} 

exports.read = (req, res) => {
    return res.json(req.playTime)
}

exports.create = (req, res) => {
    const playTime = new PlayTime(req.body);
    playTime.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
    // let form = new formidable.IncomingForm();
    // form.keepExtensions = true;
    // form.parse(req, (err, fields, files) => {
    //     // check for all fields
    //     const { date, time, movie, hall, sold } = fields;

    //     if (!date || !time || !movie || !hall || sold) {
    //         return res.status(400).json({
    //             error: 'Wszystkie pola są wymagane'
    //         });
    //     }

    //     let playTime = new PlayTime(fields);

    //     playTime.save((err, result) => {
    //         if (err) {
    //             console.log('PRODUCT CREATE ERROR ', err);
    //             return res.status(400).json({
    //                 error: errorHandler(err)
    //             });
    //         }
    //         res.json(result);
    //     })
    // });
};

exports.remove = (req, res) => {
    let playTime = req.playTime
    playTime.remove((err, deleted) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Seans skasowany"
        })
    })
}

exports.updatePlayTime = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        let playTime = req.playTime;
        playTime = _.extend(playTime, fields)

        playTime.save((err, result) => {
            if (err) {
                console.log('PLAYTIME CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
}


exports.readPlayTimes = (req, res) => {
    PlayTime.find({ movie: req.movie._id }).populate('hall', '_id name totalSeats rows totalSeatsInRow').populate('movie', '_id name photo').exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.readHalls = (req, res) => {
    PlayTime.find().populate('hall', '_id name totalSeats' ).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.ticket.playTime.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { sold: +item.seat } }
            }
        };
    });

    PlayTime.bulkWrite(bulkOps, {}, (error, movies) => {
        if (error) {
            return res.status(400).json({
                error: "Could not update product"
            });
        }
        next();
    });
};



exports.purchaseHistory = (req, res) => {
    Ticket.find({ movie: req.movie._id })
        .populate("playTime", "_id")
        .sort("-created")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(orders);
        });
};

exports.addPlayTimeToCityHistory = (req, res, next) => {
    let history = [];
 
    history.push({date: req.body.date, time: req.body.time, hall: req.body.hall})
        
    Movie.findOneAndUpdate(
        {_id: req.movie._id },
        { $push: { history: history } },
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