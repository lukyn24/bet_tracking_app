const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Bet = require('./models/bets');
const Month = require('./models/months');

mongoose.connect((process.env.MONGODB_URI || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || /* 'mongodb+srv://lukash:10295monika@cluster0.kd5x9.mongodb.net' || */ 'mongodb://127.0.0.1:27017/sazkyApp'), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
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

//index
app.get('/', async (req, res) => {
    res.render('index');
})

//new bet
app.get('/bets/new', (req, res) => {
    res.render('bets/new')
})

//new bet post
app.post('/bets', async (req, res) => {
    const newBet = new Bet(req.body);
    await newBet.save();
    console.log(newBet);
    res.redirect('/bets')
})

//viewable list
app.get('/list', async (req, res) => {
    const bets = await Bet.find({});
    bets.sort((a, b) => b.compId - a.compId)
    res.render('bets/list', { bets });
})

// my editable list
app.get('/bets', async (req, res) => {
    const bets = await Bet.find({});
    res.render('bets/show', { bets });
})

app.get('/bets/:compId/edit', async (req, res) => {
    const { compId } = req.params;
    const bets = await Bet.find({ compId: compId })
    const bet = bets[0];
    res.render('bets/edit', { bet })
})

app.put('/bets/:compId', async (req, res) => {
    const { compId } = req.params;
    const bet = await Bet.findOneAndUpdate({ compId: compId }, req.body, { runValidators: true, new: true })
    res.redirect(`/bets`);
})

app.delete('/bets/:compId', async (req, res) => {
    const { compId } = req.params;
    const deletedBet = await Bet.findOneAndDelete({ compId: compId });
    res.redirect('/bets');
})

app.get('/stats', async (req, res) => {
    const months22 = await modelateStats(2022);
    const months21 = await modelateStats(2021);

    res.render('stats', { months22, months21 });
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port 3000`)
})

const modelateStats = async (year) => {
    const months = [];
    for (let i = 1; i < 13; i++) {
        const monthBets = await Bet.find({ year: year, month: i });
        if (monthBets.length > 0) {
            let ok = 0;
            let ko = 0;
            let other = 0;
            let profit = 0;
            let stakes = 0;
            for (bet of monthBets) {
                if (bet.result == 'ok') {
                    profit += parseFloat((bet.odds - 1) * bet.stake);
                    stakes += parseFloat(bet.stake);
                    ok++;
                }
                if (bet.result == 'ko') {
                    profit -= parseFloat(bet.stake);
                    stakes += parseFloat(bet.stake);
                    ko++;
                }
                if (bet.result == 'void' || bet.result == 'non') {
                    stakes += parseFloat(bet.stake);
                    other++;
                }
            }
            const roi = profit / stakes * 100;
            const newMonth = {
                "month": i,
                "year": year,
                "ok": ok,
                "ko": ko,
                "void": other,
                "stakes": stakes,
                "profit": parseFloat(profit.toFixed(2)),
                "yield": parseFloat(roi.toFixed(2))
            }
            months.push(newMonth);
            const month = await Month.findOneAndUpdate({ year: year, month: i }, newMonth, { runValidators: true, new: true, upsert: true })
        }
    }

    await sortMonths(months);

    return months;
}

const sortMonths = (months) => {
    months.sort((a, b) => b.month - a.month);
    return months;
}