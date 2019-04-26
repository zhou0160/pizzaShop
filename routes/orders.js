const sanitizeBody = require('../middleware/sanitizeBody')
const Orders = require('../models/Order')
const authAdmin = require('../middleware/authorization')
const express = require('express')
const router = express.Router()
const ResourceNotFoundError = require('../exceptions/ResourceNotFound')
const User = require('../models/User')


router.use(require('./middleware/auth'))


router.get('/', async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id)
        let orders = await Orders.find().populate('customer pizzas')
        if (!user.isStaff) {
            orders = await orders.map(item => {
                if(item.customer._id == req.user._id){
                    return item
                }
            })
        }
        res.send({
            data: orders
        })
    } catch (err) {
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        
        let order = await Orders.findById(req.params.id).populate('customer').populate('pizzas')
        let user = await User.findById(req.user._id)
        if (!user.isStaff) {
            if (order.customer._id != req.user._id) {
                res.send({
                    errors: [{
                        status: 'Forbidden',
                        code: '403',
                        title: 'Sorry, this is not your order.'
                    }]
                })
            }
        }
        if (!order) throw new ResourceNotFoundError('Resource not found')
        res.send({
            data: order
        })
    } catch (err) {
        next(err)
    }
})

router.post('/', sanitizeBody, async (req, res, next) => {
    try {
        let newOrder = new Orders(req.sanitizedBody)
        let user = await User.findById(req.user._id)
        if (!user.isStaff) {
        newOrder.customer._id = req.user._id
        }
        await newOrder.save()
        res.send({
            data: newOrder
        })
    } catch (err) {
        next(err)
    }
})

router.patch('/:id', sanitizeBody, async (req, res, next) => {
    try {
        let theOrder = await Orders.findById(req.params.id).populate('customer').populate('pizzas')
        let user = await User.findById(req.user._id)
        if (!user.isStaff) {
            if (theOrder.customer._id != req.user._id) {
                res.send({
                    errors: [{
                        status: 'Forbidden',
                        code: '403',
                        title: 'Sorry, this is not your order.'
                    }]
                })
            }
        }
        const {
            _id,
            ...otherAttributes
        } = req.sanitizedBody
        const order = await Orders.findByIdAndUpdate(
            req.params.id, {
                _id: req.params.id,
                ...otherAttributes
            }, {
                new: true,
                runValidators: true
            }
        )
        if (!order) throw new ResourceNotFoundError('Resource not found')
        res.send({
            data: order
        })
    } catch (err) {
        next(err)
    }
})

router.put('/:id', sanitizeBody, async (req, res, next) => {
    try {
        let theOrder = await Orders.findById(req.params.id).populate('customer').populate('pizzas')
        let user = await User.findById(req.user._id)
        if (!user.isStaff) {
            if (theOrder.customer._id != req.user._id) {
                res.send({
                    errors: [{
                        status: 'Forbidden',
                        code: '403',
                        title: 'Sorry, this is not your order.'
                    }]
                })
            }
        }
        const {
            _id,
            ...otherAttributes
        } = req.sanitizedBody
        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            otherAttributes, {
                new: true,
                overwrite: true,
                runValidators: true
            }
        )
        if (!order) throw new ResourceNotFoundError('Resource not found')
        res.send({
            data: order
        })
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        let theOrder = await Orders.findById(req.params.id).populate('customer').populate('pizzas')
        let user = await User.findById(req.user._id)
        if (!user.isStaff) {
            if (theOrder.customer != req.user._id) {
                res.send({
                    errors: [{
                        status: 'Forbidden',
                        code: '403',
                        title: 'Sorry, this is not your order.'
                    }]
                })
            }
        }
        const order = await Orders.findByIdAndRemove(req.params.id)
        if (!order) throw new ResourceNotFoundError('Resource not found')
        res.send({
            data: order
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router
