const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Bet = require('./models/bets');

mongoose.connect((process.env.MONGODB_URI || 'mongodb://localhost:27017/sazkyApp'), {useNewUrlParser: true, useUnifiedTopology: true})
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

app.get('/bets/new', (req, res) => {
    res.render('bets/new')
})

app.post('/bets', async (req, res) => {
    const newBet = new Bet(req.body);
    await newBet.save();
    console.log(newBet);
    res.redirect('/')
})

app.get('/list', async (req, res) => {
    const bets = await Bet.find({});
    res.render('bets/list', { bets });
})

// TADY JE MUJ SEZNAM!!
app.get('/picks', async (req, res) => {
    const bets = await Bet.find({});
    res.render('bets/picks', { bets });
})

app.get('/picks/:compId/edit', async (req, res) => {
    const { compId } = req.params;
    const bets = await Bet.find({ compId : compId })
    const bet = bets[0];he
    res.render('bets/edit', { bet })
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port 3000`)
  })