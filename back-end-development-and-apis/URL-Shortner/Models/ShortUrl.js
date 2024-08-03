

const mongoose = require('mongoose');

const ShortUrlSchema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true
    },
    short_url_number: {
        type: Number,
        required: true
    }
});

const ShortUrlModel = mongoose.model('ShortUrl', ShortUrlSchema);

module.exports = ShortUrlModel;