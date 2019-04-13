const sanitizeBody = require('../middleware/sanitizeBody')
const Pizzas = require('../models/Pizza')
const authAdmin = require('../middleware/authorization')
const express = require('express')
const ResourceNotFoundError = require('../exceptions/ResourceNotFound')
const router = express.Router()

router.get('/', async (req, res, next) => {
    try{
        let pizzas = await Pizzas.find().populate('ingredients extraToppings')
        if(req.query.instock){
            pizzas = pizzas.filter(item => {
                if( item.ingredients.find(ingredient => ingredient.quantity == 0) || item.extraToppings.find(extraTopping => extraTopping.quantity == 0)){
                    return false;
                } else {
                    return true;
                }
            })
        }
        res.send({ data: pizzas })
    }catch(err){
        next(err)
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        const pizza = await Pizzas.findById(req.params.id).populate('ingredients').populate('extraToppings')

        if(!pizza) throw new ResourceNotFoundError('Resource not found')
        res.send({ data: pizza })
    } catch (err){
        next(err)        
    }
})

router.post('/', authAdmin, sanitizeBody, async (req, res, next) => {
    try{
        const newPizza = new Pizzas(req.sanitizedBody)
        await newPizza.save()
        res.send({ data: newPizza })
    } catch(err){
        next(err)
    }
})

router.patch('/:id', authAdmin, sanitizeBody, async (req, res, next) =>{
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
        if (!pizza) throw new ResourceNotFoundError('Resource not found')
        res.send({data: pizza})
    } catch (err){
        next(err)        
    }
})

router.put('/:id', authAdmin, sanitizeBody,async (req, res, next) => {
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
        if (!pizza) throw new ResourceNotFoundError('Resource not found')
        res.send({ data: pizza})
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', authAdmin, async (req, res, next) => {
    try {
        const pizza = await Pizzas.findByIdAndRemove(req.params.id)
        if (!pizza) throw new ResourceNotFoundError('Resource not found')
        res.send({data: pizza})
    } catch (err) {
        next(err)
    }
})

module.exports = router