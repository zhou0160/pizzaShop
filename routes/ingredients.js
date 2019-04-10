const sanitizeBody = require('../middleware/sanitizeBody')
const Ingredients = require('../models/Ingredient')
// const authAdmin
const expree = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const ingredients = await Ingredients.find()
    res.send({ data: ingredients })
})

router.get('/:id', async (req, res) => {
    try{
        const ingredients = await Ingredients.findById(req.params.id)
        if(!ingredients) throw new Error('Resource not found')
        res.send({ data: ingredients})
    } catch (err) {
        sendResourceNotFound(req, res)
    }
}) 