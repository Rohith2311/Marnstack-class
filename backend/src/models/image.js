const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    img: {
        data: Buffer,
        imgType: String
    }
})
module.exports = new mongoose.model('Image', imageSchema);