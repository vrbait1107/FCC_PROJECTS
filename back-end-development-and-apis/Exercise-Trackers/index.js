const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const Exercise = require('./Models/Exercise');
const User = require('./Models/User');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URL)
  .then((data) => {
    console.log("CONNECTED DATABASE");
  }).catch((error) => {
    throw new Error(error);
  })


app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.get('/api/users', async function (request, response) {
  try {
    const users = await User.find({}).select('username').exec();
    return response.json(users);
  } catch (error) {
    return response.json([]);
  }
});

app.post('/api/users', async function (request, response) {
  try {

    const user = await User.create({
      username: request.body.username
    });

    return response.json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post('/api/users/:_id/exercises', async function (request, response) {
  const id = request.params._id;
  const { description, duration, date } = request.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return response.json("User not found");
    }

    const exercise = await Exercise.create({
      user_id: id,
      description: description,
      duration: duration,
      date: date ? new Date(date) : new Date()
    });

    console.log(new Date().toDateString());

    return response.json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString(),
      _id: user._id,
    });

  } catch (error) {
    return response.json("Something Went Wrong");
  }

});


app.get('/api/users/:_id/logs', async function (request, response) {
  const id = request.params._id;
  const limit = request.query.limit || 500;

  try {

    const user = await User.findById(id);

    if (!user) {
      return response.json('User Not Found');
    }

    const exercises = await Exercise.find({
      user_id: id
    }).select(['description', 'duration', 'date'])
      .limit(limit)
      .exec();

    const formattedExercises = exercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));

    return response.json({
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log: formattedExercises
    });

  } catch (error) {
    console.log(error)
    return response.json('Something Went Wrong');
  }

});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
