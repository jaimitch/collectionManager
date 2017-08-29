const mongoose = require('mongoose')

const ninjaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    theme: { type: String },
    dateAcquired: { type: Date },
    dateAcquiredFormatted: { type: String },
    locationFrom: {
        city: {type: String},
        state: {type: String},
        country: {type: String, required: true, default: 'USA'}
    },
    colors: { type: Array },
    cost: { type: Number },
    gift: { type: Boolean}
});


const Ninja = mongoose.model('Ninja', ninjaSchema);

module.exports = Ninja;