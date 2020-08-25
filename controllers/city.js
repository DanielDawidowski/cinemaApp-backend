const City = require('../models/city');
const { errorHandler } = require("../helpers/dbErrorHandler")

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