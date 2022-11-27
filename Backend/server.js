const express = require('express')
const expressSession = require('express-session')
const cors = require('cors')
const path = require('path')


require('dotenv').config();
process.env
    // console.log('env', process.env);
    // const cookieParser = require('cookie-parser')
    // const bodyParser = require('body-parser')
    // const toyService = require('./services/toy.service')
    // const userService = require('./services/user.service')
    // const { save } = require('./services/toy.service')
const app = express()
const http = require('http').createServer(app)

// session setup
const session = expressSession({
    secret: 'mongoDB is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})

// Express App Config
app.use(express.json())
app.use(session)
app.use(express.static('public'))
    // app.use(cookieParser())
    // app.use(bodyParser.json())



if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}



//THIS PORTS FOR HEROKU:
// const port = process.env.PORT || 3030;
//LOCAL COMPUTER:
// const port = 3030
// app.listen(port, () => {
//     console.log(`App listening on port ${port}!`)
// });



// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const boardRoutes = require('./api/board/board.routes')
const groupRoutes = require('./api/group/group.routes')
const { connectSockets } = require('./services/socket.service.back')
connectSockets(http, session)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/board', boardRoutes)
app.use('/api/group', groupRoutes)


// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})




// ITZIK NOTE: all this funcs (are called from frontend!!!)
//  will be in the toy.routes --> toy.controller --> toyservice

// //GET LIST OF TOYS
// app.get('/api/toy/', (req, res) => {
//     const filterBy = {
//         name: req.query.name || '',
//         inStock: req.query.inStock || 0,
//     }
//     filterBy.inStock = JSON.parse(filterBy.inStock)

//     // console.log('filterBy', filterBy);
//     toyService.query(filterBy)
//         .then(toys => {
//             res.send(toys)
//         })
// })

// // UPDATE TOY
// app.put('/api/toy/edit/:toyId', (req, res) => {
//     // const { currUser } = req.session
//     // if (!currUser) return res.status(401).send('Please login')
//     const { name, price, lables, inStock, reviews } = req.body


//     // after this work: req.params.toyId; try also:_id
//     toyService.getById(req.params.toyId)
//         .then(currToy => {
//             // equal to id  or user name
//             //FOR USER: if (currToy.creator._id === currUser._id)
//             if (true) {
//                 console.log('Backend updating(put) Toy:', req.params.toyId);
//                 const toy = {
//                     _id: req.params.toyId,
//                     name,
//                     price,
//                     inStock,
//                     lables,
//                     reviews
//                     // creator: {
//                     //     _id: currUser._id,
//                     //     username: currUser.username,
//                     // }
//                 }

//                 // toyService.save(toy, currUser)
//                 toyService.save(toy)
//                     .then((savedToy) => {
//                         res.send(savedToy)
//                     })
//                     .catch(err => {
//                         console.log('Backend had error: ', err);
//                         res.status(401).send('Cannot update Toy')
//                     })

//             } else return res.status(402).send('Youre not allowed to update')
//         })
// })

// // SAVE TOY
// app.post('/api/toy/', (req, res) => {

//     // const { currUser } = req.session
//     // if (!currUser) return res.status(401).send('Please login')

//     // THIS CONSOLE_LOG NOT Worker, WHY??
//     // console.log('Backend Saving new Toy on username:', currUser.username);
//     const currToy = req.body
//     const toy = {
//         // TO FIX - THE CREATE ID FUNC SOULD BE IN THE save() FUNC IN TOY>SERVICE BACKEND
//         // _id,
//         name: currToy.name,
//         price: currToy.price,
//         // creator: {
//         //     _id: currUser._id,
//         //     username: currUser.username,
//         // }
//     }

//     // toyService.save(toy, currUser)
//     toyService.save(toy)
//         .then((savedToy) => {
//             res.send(savedToy)
//         })
// })

// //GET ONE TOY
// app.get('/api/toy/:toyId', (req, res) => {
//     console.log('Backend getting your Toy:', req.params.toyId);
//     toyService.getById(req.params.toyId)
//         .then(toy => {
//             res.send(toy)
//         })
// })

// // DELETE
// app.delete('/api/toy/:toyId', (req, res) => {

//     // const { currUser } = req.session
//     // if (!currUser) return res.status(401).send('Please login')

//     toyService.getById(req.params.toyId)
//         .then(currToy => {
//             // if (currToy.creator.username === currUser.username) {
//             if (true) {
//                 console.log('Backend removing Toy:', req.params.toyId);
//                 toyService.remove(req.params.toyId)
//                     .then(() => {
//                         res.send({ msg: 'Removed' })
//                     })

//             } else return res.status(402).send('Youre not allowed to delete')
//         })

// })

// // User
// // LOGIN
// app.post('/api/login', (req, res) => {
//     const { username, password } = req.body

//     userService.checkLogin(username, password)
//         .then(user => {
//             req.session.currUser = user
//             console.log('req.sessionID =>', req.sessionID)
//             res.send(user)
//                 // res.send('req.session', req.session)
//             console.log(username, 'logged in');
//         })
//         .catch(err => {
//             console.log(`${username} attempt login failed`, err);
//             res.status(401).send('Invalid Login (username or password)')
//         })

//     // COOKIE OPTION:
//     // const { username } = req.body
//     // res.cookie('username', username)
//     // res.send(username)
// })

// // LOGOUT
// app.post('/api/logout', (req, res) => {
//     req.session.destroy()
//     res.end()

//     console.log('user has logged out');

//     // COKIE OPTION:
//     // res.clearCookie('username')
//     // res.end()
//     // console.log('logging out');
// })

// // SIGN-UP
// app.post('/api/signup', (req, res) => {

//     // const { currUser } = req.session
//     // if (!currUser) return res.status(401).send('you already logged in!')

//     const userRequest = req.body
//     console.log(userRequest);
//     const newUserRequest = {
//         // TO FIX - CHECK CONDITIONS OF INPUT check here? if user doesnt exist ot pass is correct?
//         fullname: userRequest.fullname,
//         username: userRequest.username,
//         password: userRequest.password,
//         // createdAt,
//         // createdAt: userRequest, send to server!
//         // isAdmin: userRequest.isAdmin || false
//     }

//     userService.save(newUserRequest)
//         .then((newUser) => {
//             res.send(newUser)
//         })
// })

// // ToysCount
// app.get('/api/toysCount', (req, res) => {

//     const { currUser } = req.session
//     if (!currUser) return res.status(401).send('you are not logged in!')

//     const userId = req.body._id
//     console.log('checkkkkkkkkkkkkk:', userId);

//     toyService.countToysByUser(userId)
//         .then((toysCount) => {
//             // console.log('toysCounttoysCounttoysCount', toysCount.data);
//             res.send(toysCount)
//         })


// })