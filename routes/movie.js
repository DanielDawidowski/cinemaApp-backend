const express = require('express')
const router = express.Router()

const { hallById } = require('../controllers/hall')
const { readPlayTimes, readHalls, playTimeById, purchaseHistory } = require('../controllers/playTime')
const { cityById } = require('../controllers/city')
const { create, movieById, read, readMovies, remove, update, list, listSearch, listRelated, listHalls, listBySearch, photo, getMovieCategory, listCities} = require('../controllers/movie')
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth')
const { userById } = require('../controllers/user')


router.get("/movie/:movieId", read);
router.get("/movie/:movieId/playTimes", readPlayTimes);
router.get("/movie/:movieId/halls", readHalls);
router.get("/movie/:movieId/ticket", purchaseHistory)

router.post("/movie/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete("/movie/:movieId/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/movie/:movieId/:userId", requireSignin, isAuth, isAdmin, update);
router.get("/movies", list);
router.get("/movies/read", readMovies);
router.get("/movies/search", listSearch);
router.get("/movies/related/:movieId", listRelated);
router.get("/movies/halls", listHalls);
router.get("/movies/cities", listCities);
router.post("/movies/by/search", listBySearch);
router.get("/movie/photo/:movieId", photo);
router.get("/movie/movie-category/:userId", requireSignin, isAuth, isAdmin, getMovieCategory);


router.param("userId", userById);
router.param("cityId", cityById);
router.param("movieId", movieById);
router.param("playTimeId", playTimeById);
router.param("hallId", hallById)


module.exports = router; 