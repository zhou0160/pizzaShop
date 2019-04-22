const mongoose = require('mongoose')
const config = require('config')
const debug = require('debug')('final:db')

module.exports = () => {
    const db = config.get('db')
    let credentials = ''
    if (process.env.NODE_ENV === 'production') {
    credentials = `${db.username}:${db.password}@`
    }
    const connectionString = `mongodb://${credentials}${db.host}:${db.port}/${db.name}?authSource=admin`

    mongoose
    .connect(connectionString,{useNewUrlParser: true})
    .then(() => {
      debug(`Connected to MongoDB ...`)
    })
    .catch(err => {
      debug(`Error connecting to MongoDB ...`, err)
      process.exit(1)
    })
}