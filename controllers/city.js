const City = require('../models/city');
const { errorHandler } = require("../helpers/dbErrorHandler")
const Movie = require("../models/movie")

exports.create = (req, res) => {
    const city = new City(req.body)
    city.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({ data })
    })
}

exports.cityById = (req, res, next, id) => {
    City.findById(id).exec((err, city) => {
        if (err || !city) {
            return res.status(400).json({
                error: 'Nie ma takiego miasta'
            })
        }
        req.city = city;
        next();
    })
}

exports.read = (req, res) => {
    return res.json(req.city)
}

exports.update = (req, res) => {
    console.log('req.body', req.body);
    console.log('city update param', req.params.cityId);

    const city = req.city;
    city.name = req.body.name;
    city.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const city = req.city;
    city.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'City deleted'
        });
    });
}

exports.list = (req, res) => {
    City.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.listCities = (req, res) => {
    City.find().populate('movies', "_id name").exec((err, movies) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(movies);
    });
}; 


