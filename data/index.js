const mongoose = require('mongoose');

const userData = require('./users_data.js');
const User = require('../models/user');

mongoose.connect((process.env.MONGODB_URI || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 
'mongodb+srv://lukash:10295monika@cluster0.kd5x9.mongodb.net' || 'mongodb://127.0.0.1:27017/sazkyApp') , { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('CONNECION OPEN!!');
})
.catch((err) => {
    console.log("OH NO MONGO ERROR!!")
    console.log(err)
})

const seedDB = async () => {
    await User.deleteMany({});
    for (let us of userData) {
        const user = new User({
            name: us.name,
            handle: us.handle,
            deposits: us.invested,
            state2020: us.state2020,
            whitdrawals: us.whithdrawals,
            share: us.share,
            code: us.code
        });
        await user.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})