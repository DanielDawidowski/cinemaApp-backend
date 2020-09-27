const Hall = require('../models/hall');
const City = require('../models/city');
const formidable = require('formidable')
const _ = require("lodash")

const { errorHandler } = require("../helpers/dbErrorHandler")

exports.hallById = (req, res, next, id) => {
    Hall.findById(id).populate("id", "name").exec((err, hall) => {
        if (err || !hall) {
            return res.status(400).json({
                error: 'Hall not found'
            });
        }
        req.hall = hall;
        next();
    })
} 


exports.read = (req, res) => {
    Hall.find({ _id: req.hall._id}).populate('hall', '_id name totalSeats ').exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}


exports.create = (req, res) => {
    const hall = new Hall(req.body);
    hall.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    let hall = req.hall
    hall.remove((err, deletedHall) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Hall deleted successfully"
        })
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {

        let hall = req.hall;
        hall = _.extend(hall, fields)

        hall.save((err, result) => {
            if (err) {
                console.log('HALL CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
}

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Hall.find()
        .populate('city')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, halls) => {
            if (err) {
                return res.status(400).json({
                    error: 'Halls not found'
                });
            }
            res.json(halls);
        });
};

// exports.listHalls = (req, res) => {
//     Hall.distinct('city', {}, (err, cities) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'City not found'
//             });
//         }
//         res.json(cities);
//     });
// };

exports.listHallsByCityId = (req, res) => {
    Hall.find()
        .select("name")
        .exec((err, halls) => {
            if (err) {
                return res.status(400).json({
                    error: 'Halls not found'
                });
            }
            res.json(halls);
        });
};

// exports.readMovies = (req, res) => {
//     Movie.find().select("name").exec((err, data) => {
//         if (err) {
//             return res.status(400).json({
//                 error: errorHandler(err)
//             });
//         }
//         res.json(data);
//     });
// }

exports.addHallToCityHalls = (req, res, next) => {
    let history = [];

    history.push({name: req.body.name, total: req.body.totalSeats})

    City.findOneAndUpdate(
        {_id: req.city._id },
        { $push: { halls: history } },
        { new: true },
        (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: "Could not update city purchase history"
                });
            }
            next();
        }
    );
};

