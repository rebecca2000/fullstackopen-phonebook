const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const app = express()
app.use(express.static('build'))
app.use(express.json())

morgan.token('content', function (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

const cors = require('cors')
app.use(cors())
const Person = require('./models/person')

const baseURL = '/api/persons'

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get(baseURL, (_request, response) => {
  Person.find({}).then(persons => {
    response.json(persons).end()
  })
})

app.get('/info', (_, response) => {
  Person.find({}).then(persons => {
    response.send(
      `
            Phonebook has info for ${persons.length} people <br/>
            ${new Date()}
            `
    )
  })
})

app.get(`${baseURL}/:id`, (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    response.json(person).end()
  }).catch(err => next(err))
})

app.delete(`${baseURL}/:id`, (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

app.post(baseURL, (request, response, next) => {
  const body = request.body
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(() => {
    return response.json(newPerson)
  }).catch(err => next(err))
})

app.put(`${baseURL}/:id`, (request, response, next) => {
  if (!request.body.number) {
    console.log('number missing')
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const update = {
    number: request.body.number,
  }

  Person.findByIdAndUpdate(request.params.id, update, { runValidators: true, new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
