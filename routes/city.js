const express = require('express')
const router = express.Router()

const { readMovies } = require("../controllers/movie")
const { create, cityById, read, update, remove, list, listCities } = require('../controllers/city')
const { userById } = require('../controllers/user')
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth')


router.get("/city/:cityId", read)
router.get('/city/:cityId/movies', readMovies)

router.post("/city/create/:userId", requireSignin, isAuth, isAdmin, create)
router.put("/city/:cityId/:userId", requireSignin, isAuth, isAdmin, update)
router.delete("/city/:cityId/:userId", requireSignin, isAuth, isAdmin, remove)
router.get("/cities", list)
router.get("/cities/movies", listCities)


router.param("userId", userById)
router.param("cityId", cityById)



module.exports = router;