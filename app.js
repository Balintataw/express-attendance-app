const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const request = require('request')
const mustacheExpress = require('mustache-express')

const app = express()

const apiURL = 'https://randomuser.me/api/'

let db = {
    accepted: [],
    declined: []
}
app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', path.join(__dirname, '/views'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false})) //put something here
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res, next) => {
    request(apiURL, (err, resp) => {
        const body = JSON.parse(resp.body)
        const data = {
            picture: body.results[0].picture.large,
            name: body.results[0].name.first + body.results[0].name.last,
            email: body.results[0].email,
            cell: body.results[0].cell,
            countAccepted: db.accepted.length || '0',
            countDeclined: db.declined.length || '0',
        }
        res.render('home', data)
    })
})

app.get('/accepted', (req, res, next) => {
    const data = db.accepted
    res.render('accepted', db)
})

app.get('/declined', (req, res, next) => {
    const data = db.declined
    res.render('declined', db)
})

app.post('/accepting', (req, res, next) => {
    const person = {
        picture: req.body.picture,
        name: req.body.name,
        cell: req.body.phone,
        email: req.body.email
    }
    db.accepted.push(person)
    res.redirect('/')
})

app.post('/declining', (req, res, next) => {
    const person = {
        picture: req.body.picture,
        name: req.body.name,
        cell: req.body.phone,
        email: req.body.email
    }
    db.declined.push(person)
    res.redirect('/')
})

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
  
app.listen(3001, () => {
    console.log('Listening on port 3001')
})
