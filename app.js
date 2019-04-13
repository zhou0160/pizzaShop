'use strict'

require('./startup/database')()

const debug = require('debug')('final')

const express = require('express')
const app = express()

app.use(express.json())
app.use(require('express-mongo-sanitize')())

app.use('/auth', require('./routes/auth/index'))

app.use('/api/pizzas', require('./routes/pizzas'))
app.use('/api/ingredients', require('./routes/ingredients'))
app.use('/api/orders', require('./middleware/auth'))
app.use('/api/orders', require('./routes/orders'))

app.use(require('./middleware/logErrors'))
app.use(require('./middleware/errorHandler'))

const port = process.env.PORT || 3030
app.listen(port, () => debug(`Express is listening on port ${port} ...`))