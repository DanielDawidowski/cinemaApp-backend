const express = require('express')
const router = express.Router()

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')
const { userById } = require('../controllers/user')
const { createTicket, ticketById, addTicketToPlayTimeHistory, readTicket, listTickets } = require('../controllers/ticket')
const { decreaseQuantity ,playTimeById, purchaseHistory } = require('../controllers/playTime')
const { movieById } = require('../controllers/movie')

router.post("/ticket/:playTimeId/create", addTicketToPlayTimeHistory, createTicket)
router.get("/ticket/:movieId", readTicket)
router.get("/ticket/:ticketId/list", requireSignin, isAuth, isAdmin, listTickets)
router.get("/ticket/by/:playTimeId", purchaseHistory)

router.param("playTimeId", playTimeById); 
router.param("movieId", movieById);
router.param("ticketId", ticketById)
router.param("userId", userById)

module.exports = router