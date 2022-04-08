import express, { response } from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from 'bcrypt'
import User from './models/User.js'
import Post from './models/Post.js'
import Comment from './models/Comment.js'
import jwt from 'jsonwebtoken'

const secret = 'secret1234567'
const app = express()
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)

await mongoose.connect('mongodb://localhost:27017/reddit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', function (err) {
  console.error('connection error;', err)
})

app.get('/', (req, res) => {
  res.send('ok')
})

app.post('/register', (req, res) => {
  const { email, username } = req.body
  const password = bcrypt.hashSync(req.body.password, 10)
  const user = new User({ email, username, password })
  user
    .save()
    .then(user => {
      jwt.sign({ id: user._id }, secret, (err, token) => {
        if (err) {
          console.error(err)
          res.sendStatus(500)
        } else {
          console.log(user)
          res.status(201).cookie('token', token).send()
        }
      })
    })
    .catch(e => {
      console.error(e)
      res.sendStatus(500)
    })
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  User.findOne({ username }).then(user => {
    if (user && user.username) {
      const passOk = bcrypt.compareSync(password, user.password)
      if (passOk) {
        jwt.sign({ id: user._id }, secret, (err, token) => {
          res.cookie('token', token).send()
        })
      } else {
        res.status(422).json('Invalid username or password')
      }
    } else {
      res.status(422).json('Invalid username or password')
    }
  })
})

app.get('/user', (req, res) => {
  const token = req.cookies.token
  console.log({ token })
  const userInfo = jwt.verify(token, secret)

  User.findById(userInfo.id)
    .then(user => {
      res.json({ username: user.username })
    })
    .catch(e => {
      console.error(e)
      res.sendStatus(500)
    })
})

app.post('/logout', (req, res) => {
  res.cookie('token', '').send()
})

app.get('/posts', (req, res) => {
  Post.find().then(posts => {
    console.log(posts)
    res.send(posts)
  })
})

app.get('/comments', (req, res) => {
  Comment.find().then(comments => {
    console.log(comments)
    res.send(comments)
  })
})

app.get('/comments/:id', (req, res) => {
  Comment.findById(req.params.id).then(comment => {
    res.json(comment)
  })
})

app.listen(4000)
