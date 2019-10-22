const mongoose = require('mongoose');

var option = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    correct: {
        type: Boolean,
        default: false
    }
}, {
    _id: false
});

var question = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [option],
        default: []
    }

}, {
    _id: false
});

var schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    createdDate: {
        type: Date
    },
    activated: {
        type: Boolean,
        default: false
    },
    questions: {
        type: [question],
        default: []
    }
});

module.exports = mongoose.model('Quizzes', schema);
