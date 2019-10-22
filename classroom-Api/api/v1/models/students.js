const mongoose = require('mongoose');

var validate = {
    alphaNumeric: {
        validator: (v) => {
            return /^[a-zA-Z0-9-_ ]*$/.test(v);
        },
        message: 'Only alpha-numeric values are accepted!'
    },
    strictNumber: {
        validator: (v) => {
            return !isNaN(parseFloat(v)) && isFinite(v);
        },
        message: 'This field must be a number!'
    }
};

var activityLog = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'date is a required field!']
    },
    log: {
        type: String,
        required: [true, 'log is a required field!']
    },
    weight: {
        type: Number,
        required: [true, 'weight is a required field!'],
        validate: validate.strictNumber
    },
    mark: {
        type: Number,
        required: [true, 'mark is a required field!'],
        validate: validate.strictNumber
    }
}, {
    _id: false
});

var goal = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is a required field!']
    },
    completed: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    completionDate: {
        type: Date
    },
    startDate: {
        type: Date
    },
    mark: {
        type: Number,
        default: 0,
        validate: validate.strictNumber
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classrooms'
    },
    activityLog: {
        type: [activityLog],
        default: []
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goals'
    }
});

var quiz = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'question is a required field!']
    },
    answer: {
        type: String,
        required: [true, 'answer is a required field!']
    },
    correct: {
        type: Boolean,
        default: false,
    }
}, {
    _id: false
});

var quizHistory = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is a required field!']
    },
    mark: {
        type: Number,
        default: 0,
        validate: validate.strictNumber
    },
    weight: {
        type: Number,
        default: 0,
        validate: validate.strictNumber
    },
    results: {
        type: [quiz],
        default: []
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quizzes'
    }
});

var schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is a required field!'],
        validate: validate.alphaNumeric
    },
    lastName: {
        type: String,
        required: [true, 'lastName is a required field!'],
        validate: validate.alphaNumeric
    },
    displayName: {
        type: String,
        default: 'Student',
        validate: validate.alphaNumeric
    },
    username: {
        type: String,
        required: [true, 'username is a required field!'],
        unique: [true, 'username must be unique'],
        validate: validate.alphaNumeric
    },
    password: {
        type: String,
        required: true,
        required: [true, 'password is a required field!'],
        select: false
    },
    birthday: {
        type: Date
    },
    classrooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classrooms'
    }],
    quizHistory: {
        type: [quizHistory],
        default: []
    },
    attendanceHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendances',
        default: []
    }],
    goals: {
        type: [goal],
        default: []
    }
});

module.exports = mongoose.model('Students', schema);
