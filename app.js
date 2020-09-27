const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const cors = require('cors')

require('dotenv').config()

// routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const cityRoutes = require('./routes/city')
const hallRoutes = require('./routes/hall')
const movieRoutes = require('./routes/movie')
const playTimeRoutes = require('./routes/playTime')
const ticketRoutes = require('./routes/ticket')


// app
const app = express()

//db
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }).then(() => console.log("DB connected"));

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())

// routes middlewares
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", cityRoutes)
app.use("/api", hallRoutes)
app.use("/api", movieRoutes)
app.use("/api", playTimeRoutes)
app.use("/api", ticketRoutes)



const port = process.env.PORT || 8000
app.set("port", PORT)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})