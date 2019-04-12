const sanitizeBody = require('../middleware/sanitizeBody')
const Pizzas = require('../models/Pizza')
const authAdmin = require('../middleware/authorization')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const pizzas = await Pizzas.find().populate('ingredients').populate('extraToppings')
    res.send({ data: pizzas })
})

router.get('/:id', async (req, res) => {
    try{
        const pizza = await Pizzas.findById(req.params.id).populate('ingredients').populate('extraToppings')
        if(!pizza) throw new Error('Resource not found')
        res.send({ data: pizza })
    } catch (err){
        sendResourceNotFound(req, res)
    }
})

router.post('/', authAdmin, sanitizeBody, async (req, res) => {
    const newPizza = new Pizzas(req.sanitizeBody)
    await newPizza.save()
    res.send({ data: newPizza })
})

router.patch('/:id', authAdmin, sanitizeBody, async (req, res) =>{
    try{
        const {_id, ...otherAttributes} = req.sanitizedBody
        const pizza = await Pizzas.findByIdAndUpdate(
            req.params.id,
            {
                _id: req.params.id, ...otherAttributes
            },
            {
                new: true,
                runValidators: true
            }
        )
        if (!pizza) throw new Error('Resource not found')
        res.send({data: pizza})
    } catch (err){
        sendResourceNotFound(req, res)
    }
})

router.put('/:id', authAdmin, sanitizeBody,async (req, res) => {
    try{
        const {_id, ...otherAttributes} = req.sanitizedBody
        const pizza = await Pizzas.findByIdAndUpdate(
            req.params.id,
            otherAttributes,
            {
                new: true,
                overwrite: true,
                runValidators: true
            }
        )
        if (!pizza) throw new Error('Resource not found')
        res.send({ data: pizza})
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

router.delete('/:id', authAdmin, async (req, res) => {
    try {
        const pizza = await Pizzas.findByIdAndRemove(req.params.id)
        if (!pizza) throw new Error('Resource not found')
        res.send({data: pizza})
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

function sendResourceNotFound(req, res) {
    res.status(404).send({
        errors: [
            {
                status: 'Not Found',
                code: '404',
                title: 'Resource does not exist',
                description: `We could not find a pizza with id: ${req.params.id}`
            }
        ]
    })
}

module.exports = router