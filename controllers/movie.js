const Movie = require('../models/movie');
const formidable = require('formidable')
const City = require('../models/city')
const _ = require("lodash")
const fs = require('fs')
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.movieById = (req, res, next, id) => {
    Movie.findById(id).populate('city').exec((err, movie) => {
        if (err || !movie) {
            return res.status(400).json({
                error: 'Movie not found'
            });
        }
        req.movie = movie;
        next();
    })
} 

exports.read = (req, res) => {
    req.movie.photo = undefined
    return res.json(req.movie)
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        // check for all fields
        const { name, description, price, movieCategory, city } = fields;

        if (!name || !description || !price || !movieCategory || !city ) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let movie = new Movie(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1500000) {
                return res.status(400).json({
                    error: 'Zdjęcie musi zawierać maximum 1.5 MB'
                });
            }
            movie.photo.data = fs.readFileSync(files.photo.path);
            movie.photo.contentType = files.photo.type;
        }

        movie.save((err, result) => {
                if (err) {
                    console.log('PRODUCT CREATE ERROR ', err);
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(result);
            })
    });
};

exports.remove = (req, res) => {
    let movie = req.movie
    movie.remove((err, deletedMovie) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Movie deleted successfully"
        })
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        // check for all fields
        // const { name, description, price, category, quantity, shipping } = fields;

        // if (!name || !description || !price || !category || !quantity || !shipping) {
        //     return res.status(400).json({
        //         error: 'All fields are required'
        //     });
        // }

        let movie = req.movie;
        movie = _.extend(movie, fields)

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            movie.photo.data = fs.readFileSync(files.photo.path);
            movie.photo.contentType = files.photo.type;
        }

        movie.save((err, result) => {
            if (err) {
                console.log('PRODUCT CREATE ERROR ', err);
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

    Movie.find()
        .select('-photo')
        .populate('city')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, movies) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(movies);
        });
};

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Movie.find({ _id: { $ne: req.movie }, city: req.movie.city })
        .limit(limit)
        .populate('city', '_id name')
        .exec((err, movies) => {
            if (err) {
                return res.status(400).json({
                    error: 'Movies not found'
                });
            }
            res.json(movies);
        });
};

exports.listHalls = (req, res) => {
    Movie.distinct('hall', {}, (err, halls) => {
        if (err) {
            return res.status(400).json({
                error: 'Hall not found'
            });
        }
        res.json(halls);
    });
};

exports.listCities = (req, res) => {
    Movie.distinct('city', {}, (err, cities) => {
        if (err) {
            return res.status(400).json({
                error: 'City not found'
            });
        }
        res.json(cities);
    });
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Movie.find(findArgs)
        .select("-photo")
        .populate("city")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Movie not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.movie.photo.data) {
        res.set('Content-Type', req.movie.photo.contentType);
        return res.send(req.movie.photo.data);
    }
    next();
};

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        // assigne category value to query.category
        if (req.query.city && req.query.city != 'All') {
            query.city = req.query.city;
        }
        // find the product based on query object with 2 properties
        // search and category
        Movie.find(query, (err, movies) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(movies);
        }).select('-photo');
    }
};

exports.getMovieCategory = (req, res) => {
    res.json(Movie.schema.path("movieCategory").enumValues);
};

exports.readMovies = (req, res) => {
    Movie.find({city: req.city._id}).populate("city", "_id name").exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.addMovieToCityMovies = (req, res, next) => {
    let history = [];

    history.push(req)
    // console.log(req.checkBody)
        
    City.findOneAndUpdate(
        {_id: req.city._id },
        { $push: { movies: history } },
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

