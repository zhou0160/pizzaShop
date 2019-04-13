const sanitizeBody = require('../middleware/sanitizeBody')
const Orders = require('../models/Order')
const authAdmin = require('../middleware/authorization')
const express = require('express')
const router = express.Router()
const ResourceNotFoundError = require('../exceptions/ResourceNotFound')


router.get('/', async (req, res, next) => {
    try{
        const orders = await Orders.find().populate('customer').populate('pizzas')
        res.send({ data: orders })
    } catch(err){
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        const order = await Orders.findById(req.params.id).populate('customer').populate('pizzas')
        if(!order) throw new ResourceNotFoundError('Resource not found')
        res.send({ data: order })
    } catch (err){
        next(err)
    }
})

router.post('/', authAdmin, sanitizeBody, async (req, res, next) => {
    try{
        const newOrder = new Orders(req.sanitizedBody)
        await newOrder.save()
        res.send({ data: newOrder })
    } catch(err){
        next(err)
    }
})

router.patch('/:id', authAdmin, sanitizeBody, async (req, res, next) =>{
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
        if (!order) throw new ResourceNotFoundError('Resource not found')
        res.send({data: order})
    } catch (err){
        next(err)
    }
})

router.put('/:id', authAdmin, sanitizeBody,async (req, res, next) => {
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
        if (!order) throw new ResourceNotFoundError('Resource not found')
        res.send({ data: order})
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', authAdmin, async (req, res, next) => {
    try {
        const order = await Orders.findByIdAndRemove(req.params.id)
        if (!order) throw new ErrResourceNotFoundErroror('Resource not found')
        res.send({data: order})
    } catch (err) {
        next(err)        
    }
})

module.exports = router