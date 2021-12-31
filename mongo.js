const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length > 5) {
    console.log('COMMAND LINE PHONEBOOK DB INSTRUCTIONS:')
    console.log('List all records in phonebook: node mongo.js <password>')
    console.log('Add new record to phonebook: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://fullstack:${password}@cluster0.34uzm.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url)
const recordSchema = new mongoose.Schema({
    name: String,
    number: String
  })
const Record = mongoose.model('Record', recordSchema)

if (process.argv.length == 3) {
    console.log('Phonebook:')
    Record.find({}).then(result => {
        result.forEach(record => {
          console.log(`${record.name} ${record.number}`)
        })
        mongoose.connection.close()
      })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    const newRecord = new Record({
        name: name,
        number: number
    })
    
    newRecord.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
