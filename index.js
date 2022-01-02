const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Bet = require('./models/bets');
const Month = require('./models/months');
const User = require('./models/user');

<<<<<<< HEAD
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sazkyApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then (() => {
=======
mongoose.connect((process.env.MONGODB_URI || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 
 /* 'mongodb://127.0.0.1:27017/sazkyApp' || */ 'mongodb+srv://lukash:10295monika@cluster0.kd5x9.mongodb.net'), { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
>>>>>>> 6abf46cdaedcc9ce3f2b69e417ece94d6d7b82c9
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

<<<<<<< HEAD
=======
//new bet
app.get('/bets/new', (req, res) => {
    res.render('bets/new')
})

//new bet post
app.post('/bets', async (req, res) => {
    const newBet = new Bet(req.body);
    await newBet.save();
    await modelateStats(2022);
    await modelateUsers();
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
    await modelateStats(2022);
    await modelateUsers();
    res.redirect(`/bets`);
})

app.delete('/bets/:compId', async (req, res) => {
    const { compId } = req.params;
    const deletedBet = await Bet.findOneAndDelete({ compId: compId });
    await modelateStats(2022);
    await modelateUsers();
    res.redirect('/bets');
})

app.get('/stats', async (req, res) => {
    const months22 = await Month.find({ year: 2022 });
    const months21 = await Month.find({ year: 2021 });

    await sortMonths(months22);
    await sortMonths(months21);

    res.render('stats', { months22, months21 });
})

app.get('/user/:code', async (req, res) => {
    const { code } = req.params;
    const foundUser = await User.find({ code: code });
    const specUser = foundUser[0];
    res.render('user', { specUser });
})

>>>>>>> 6abf46cdaedcc9ce3f2b69e417ece94d6d7b82c9
app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port 3000`)
})

app.get('/login', async (req, res) => {
    res.render('login');
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
            const month = await Month.findOneAndUpdate({ year: year, month: i }, newMonth, { runValidators: true, new: true, upsert: true })
        } else {
            const monthBets = await Month.findOneAndDelete({ year: year, month: i });
        }
    }
}

const modelateUsers = async () => {
    const users = await User.find();
    const months = await Month.find({ year: 2022 });
    let profit = 0;
    for (let month of months) {
        profit += parseFloat(month.profit);
    }
    for (us of users) {
        const unit = (us.handle == 'TG1') ? 220 : us.state2020 * 0.003;
        const userProfit = profit * unit * us.share;
        const currentState = us.state2020 + userProfit;
        const whithdrawals = us.whitdrawals;
        const roiOverall = (((currentState + whithdrawals) / (us.deposits + whithdrawals) - 1) * 100).toFixed(1);
        const roi2022 = ((currentState / us.state2020 - 1) * 100).toFixed(1)

        const updateUser = await User.findOneAndUpdate({ code: us.code }, { currentState: currentState, roiOverall: roiOverall, roi2022: roi2022 }, { runValidators: true, new: true });
    }
}

const sortMonths = (months) => {
    months.sort((a, b) => b.month - a.month);
    return months;
}