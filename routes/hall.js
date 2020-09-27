const express = require('express')
const router = express.Router()

const { cityById } = require('../controllers/city')
const { create, hallById, remove, update, read, list, listHallsByCityId, addHallToCityHalls} = require('../controllers/hall')
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth')
const { userById } = require('../controllers/user')

router.get("/hall/:hallId", read)
router.post("/hall/create/:userId/:cityId", requireSignin, isAuth, isAdmin, addHallToCityHalls, create);
router.delete("/hall/:hallId/:userId", requireSignin, isAuth, isAdmin, remove)
router.put("/hall/:hallId/:userId", requireSignin, isAuth, isAdmin, update)
router.get("/halls/:cityId", listHallsByCityId);
router.get("/halls", list);

router.param("userId", userById)
router.param("hallId", hallById)
router.param("cityId", cityById)


module.exports = router; 