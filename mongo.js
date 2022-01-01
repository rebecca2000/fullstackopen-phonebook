const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length > 5) {
    console.log('COMMAND LINE PHONEBOOK DB INSTRUCTIONS:')
    console.log('List all persons in phonebook: node mongo.js <password>')
    console.log('Add new person to phonebook: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://fullstack:${password}@cluster0.34uzm.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url)
const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    const newPerson = new Person({
        name: name,
        number: number
    })
    
    newPerson.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
