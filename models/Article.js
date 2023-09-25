const { Schema, model } = require('mongoose');

const ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
    }
});

module.exports = model('Article', ArticleSchema);
