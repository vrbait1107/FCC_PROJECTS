const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    username: { type: String },
    description: { type: String },
    duration: { type: Number },
    date: { type: Date }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;