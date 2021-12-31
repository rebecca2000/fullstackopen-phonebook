const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
morgan.token('content', function (req, res) { 
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

const cors = require('cors')
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const baseURL = '/api/persons'

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get(baseURL, (_request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `
        Phonebook has info for ${persons.length} people <br/>
        ${new Date()}
        `
    )
})

app.get(`${baseURL}/:id`, (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    }
    response.statusMessage = 'Invalid ID provided'
    response.status(404).end()
})

app.delete(`${baseURL}/:id`, (request, response) => {
    const id = Number(request.params.id)
    const originalNumPersons = persons.length
    persons = persons.filter(p => p.id !== id)
    if (originalNumPersons === persons.length) {
        // nothing deleted, ID invalid
        response.statusMessage = 'Invalid ID provided'
        response.status(404).end()
    }
    response.status(204).end()
})

const generateId = () => {
    let id = Math.round(Math.random() * 10000)
    while (persons.find(p => p.id === id)) {
        id = Math.round(Math.random() * 10000)
    }
    return id
}

app.post(baseURL, (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    } else if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    } else if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
  
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
