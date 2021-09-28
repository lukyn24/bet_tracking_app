const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Competition = require('./models/bets');

mongoose.connect('mongodb://localhost:27017/vysledky', {useNewUrlParser: true, useUnifiedTopology: true})
.then (() => {
    console.log('CONNECION OPEN!!');
})
.catch((err) => {
    console.log("OH NO MONGO ERROR!!")
    console.log(err)
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    res.render('index');
})

app.listen(3000, () => {
    console.log(`Listening on port 3000`)
  })