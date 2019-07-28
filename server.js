const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({});

const bodyQuerySchema = joi.object({
    id:joi.string().required(),
    title: joi.string().required(),
    completed: joi.string().required()
});

const paramsQuerySchema = joi.object({
    id: joi.string().required(),
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

let task = [
{id:'1', title:'wake up', completed:"false"}, 
{id:'2', title:'do morning exercise', completed:"false"}, 
{id:'3', title:'have a taste breakfest', completed:"false"}
];

app.get('/', function (req, res, next) {
  res.send('Hello You need to authorize yourself')
});

// Authorization header has to be equal 'admin' in order to get access.
const Authorization = app.use(function (req, res, next) {
  if (req.headers.authorization === 'admin') {
      console.log('Authorised user')
  } else {
      console.log('Accecs is forbidden');
      next(403);
  }
  next()
});

const getAllTask = app.get('/task', (req, res) =>{
  if (task == null) {
  console.log('Task not found');
  next(404);
  } else res.status(200).send(task)
  });

const getTaskById = app.get('/task/:id',validator.params(paramsQuerySchema), (req, res) => {
  let id = req.params.id;
  result = task.filter(item => item.id === id);
  res.status(200).send(result);
});

const addTask = app.post('/task', validator.body(bodyQuerySchema), function (req, res) {
  let newTask = req.body;
  task.push(newTask);
  res.redirect("/task");
});

const removeTask = app.delete('/task/:id', validator.params(paramsQuerySchema), (req, res) => {
  let id = req.params.id;
  task = task.filter(item => item.id !== id);
  res.redirect("/task");
});

const markDoneandUndone = app.put('/task/:id', validator.params(paramsQuerySchema), (req, res) => {
  let id = req.params.id;
  task.forEach(item => {
    if (item.id == id && !item.completed) item.completed = true 
    else item.completed = false;
    if (item.id != id) {
      console.log('id is failed');
      next(400);
    }
    res.status(200).send(task);
  })
});

app.all('*', function(req, res){
  res.status(404).send('Page not found');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(port, function() {
  console.log("server is running on port 4000");
});
