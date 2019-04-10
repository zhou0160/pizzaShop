const mongoose = require('mongoose')
const debug = require('debug')('final:db')

module.exports = () => {
    mongoose
    .connect(`mongodb://localhost:27017/mad9124`, {useNewUrlParser: true})
    .then(() => {
      debug(`Connected to MongoDB ...`)
    })
    .catch(err => {
      debug(`Error connecting to MongoDB ...`, err)
      process.exit(1)
    })
}