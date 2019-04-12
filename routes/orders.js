const sanitizeBody = require('../middleware/sanitizeBody')
const Orders = require('../models/Order')
const authAdmin = require('../middleware/authorization')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const orders = await Orders.find().populate('customer').populate('pizzas')
    res.send({ data: orders })
})

router.get('/:id', async (req, res) => {
    try{
        const order = await Orders.findById(req.params.id).populate('customer').populate('pizzas')
        if(!order) throw new Error('Resource not found')
        res.send({ data: order })
    } catch (err){
        sendResourceNotFound(req, res)
    }
})

router.post('/', authAdmin, sanitizeBody, async (req, res) => {
    const newOrder = new Orders(req.sanitizeBody)
    await newOrder.save()
    res.send({ data: newOrder })
})

router.patch('/:id', authAdmin, sanitizeBody, async (req, res) =>{
    try{
        const {_id, ...otherAttributes} = req.sanitizedBody
        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            {
                _id: req.params.id, ...otherAttributes
            },
            {
                new: true,
                runValidators: true
            }
        )
        if (!order) throw new Error('Resource not found')
        res.send({data: order})
    } catch (err){
        sendResourceNotFound(req, res)
    }
})

router.put('/:id', authAdmin, sanitizeBody,async (req, res) => {
    try{
        const {_id, ...otherAttributes} = req.sanitizedBody
        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            otherAttributes,
            {
                new: true,
                overwrite: true,
                runValidators: true
            }
        )
        if (!order) throw new Error('Resource not found')
        res.send({ data: order})
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

router.delete('/:id', authAdmin, async (req, res) => {
    try {
        const order = await Orders.findByIdAndRemove(req.params.id)
        if (!order) throw new Error('Resource not found')
        res.send({data: order})
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
                description: `We could not find a order with id: ${req.params.id}`
            }
        ]
    })
}

module.exports = router