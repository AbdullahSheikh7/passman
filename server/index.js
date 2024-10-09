import express from 'express'
import mongoose from 'mongoose'
import websitesRoute from "./routes/websitesRoute.js"
import cors from 'cors'
import "dotenv/config"

const app = express()
const port = 4000

app.use(express.json())

app.use(cors({
  origin: [process.env.FRONTEND],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))

app.use('/passwords', websitesRoute)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

try {
  await mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('App connected to the database')

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
} catch(e) {
  console.log(e)
}
