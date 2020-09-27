const express = require('express')
const router = express.Router()
const { movieById } = require('../controllers/movie')
const { cityById } = require('../controllers/city')
const { create, read, remove, updatePlayTime, addPlayTimeToCityHistory, playTimeById } = require('../controllers/playTime')
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth')
const { userById } = require('../controllers/user')

router.get("/playTime/:playTimeId", read);
router.post("/playTime/create/:userId/:movieId", requireSignin, isAuth, isAdmin, addPlayTimeToCityHistory, create);
router.delete("/playTime/:playTimeId/:userId", requireSignin, isAuth, isAdmin, remove);
router.put("/playTime/:playTimeId/update", updatePlayTime);

router.param("userId", userById);
router.param("playTimeId", playTimeById);
router.param("cityId", cityById)
router.param("movieId", movieById)

module.exports = router; 