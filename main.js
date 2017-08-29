const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Ninja = require('./models/ninja.js');
const moment = require('moment');
moment().format();
// const viewController = require('view-controller')

const application = express();

application.set('views', '/views');
application.set('view engine', 'mustache-express');

application.engine('mustache', mustache());
application.set('views', './views');
application.set('view engine', 'mustache');


application.use('/public', express.static('./public'));
application.use(bodyParser.urlencoded());

mongoose.connect('mongodb://localhost:27017/MagnetsApplication')

application.get('/', async (request, response) => {
    var ninja = await Ninja.find();
    var model = {ninja: ninja}
    response.render('index', model)
});

application.get('/data', async (request, response) => {
    var ninja = await Ninja.find();
    var model = {ninja: ninja}
    response.send(model);
});

application.get('/add', (request, response) => {
    response.render('add');
})

application.post('/add', async (request, response) => {
    var colorSplits = /, | |,/
    var splitColors = colorSplits[Symbol.split](request.body.colors)
    var newNinja = new Ninja({
        name: request.body.name,
        description: request.body.description,
        theme: request.body.theme,
        dateAcquired: request.body.dateAcquired,
        dateAcquiredFormatted: moment(request.body.dateAcquired).format('ddd MMM Do YYYY'),
        locationFrom: {
            city: request.body.city,
            state: request.body.state,
            country: request.body.country
        },
        colors: splitColors,
        cost: request.body.cost,
        gift: request.body.gift
    });

    await newNinja.save()
    response.redirect('/');
})

application.post('/update/:id', async (request, response) => {
    var ninjaId = request.params.id;
    var dateAcquired = request.body.dateAcquired;
    var colorSplits = /, | |,/
    var splitColors = colorSplits[Symbol.split](request.body.colors)
    var updateNinja = await Ninja.updateOne({_id: ninjaId},
        {
        name: request.body.name,
        description: request.body.description,

        dateAcquired: moment(dateAcquired, 'ddd MMM Do YYYY').toDate(),
        dateAcquiredFormatted: request.body.dateAcquired,
        locationFrom: {
            city: request.body.city,
            state: request.body.state,
            country: request.body.country
        },
        colors: splitColors,
        cost: request.body.cost,
        // gift: request.body.gift
    });
    response.redirect('/');
})

application.post('/delete/:id', async (request, response) => {
    await Ninja.findByIdAndRemove(request.params.id);
    response.redirect('/');
})

console.log('app started')
application.listen(3000);
