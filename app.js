const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()

// routes
const userRoutes = require('./routes/user')

// app
const app = express()

//db
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => console.log("DB connected"));

// routes
app.use("/api", userRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})