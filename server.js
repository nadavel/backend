import express from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}

const app = express()
const port = 3030

// App configuration
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())


// Routes
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)


// Some example routes

app.get('/', (req, res) => {
    res.send(`<h1>Hi Express</h1>`)
})

app.get('/puki', (req, res) => {
    let visitCount = +req.cookies.visitCount
    console.log(visitCount);
    res.cookie('visitCount', visitCount + 1 || 1)
    res.send(`<h1>Hi Puki</h1>`)
})

app.get('/nono', (req, res) => {
    res.redirect('/puki')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    loggerService.info('Up and running on port 3030')
})