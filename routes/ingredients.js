const sanitizeBody = require('../middleware/sanitizeBody')
const Ingredients = require('../models/Ingredient')
const authAdmin = require('../middleware/authorization')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const ingredients = await Ingredients.find()
    res.send({ data: ingredients })
})

router.get('/:id', async (req, res) => {
    try{
        let ingredients = await Ingredients.findById(req.params.id)
        if(req.query.instock){
            ingredients = ingredients.filter(ingredient => ingredient.quantity > 0)
        }
        if(!ingredients) throw new Error('Resource not found')
        res.send({ data: ingredients})

    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

router.post('/', authAdmin, sanitizeBody, async (req, res) => {
    const newIngredient = new Ingredients(req.santizedBody)
    await newIngredient.save()
    res.status(201).send({ data: newIngredient })
})

router.patch('/:id', authAdmin, sanitizeBody, async (req, res) => {
    try{
        const {_id, ... otherAttributes} = req.santizedBody
        const ingredient = await Ingredients.findByIdAndUpdate(
            req.params.id,
            {
                _id: req.params.id, ...otherAttributes
            },
            {
                new: true,
                runValidators: true
            }
        )
        if (!ingredient) throw new Error('Resource not found')
        res.send({ data: student })
    } catch (err){
        sendResourceNotFound(req, res)
    }
})

router.put('/:id', authAdmin, sanitizeBody, async (req, res) => {
    try{
        const {_id, ...otherAttributes} = req.santizedBody
        const ingredient = await Ingredients.findByIdAndUpdate(
            req.params.id,
            {
                _id: req.params.id, ...otherAttributes
            },
            {
                new: true,
                overwrite: true,
                runValidators: true
            }
        )
        if (!ingredient) throw new Error('Resource not found')
        res.send({ data: ingredient })
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

router.delete('/:id', authAdmin, async (req, res) => {
    try{
        const ingredient = await Ingredients.findByIdAndRemove(req.params.id)
        if (!student) throw new Error('Resource not found')
        res.send({ data: ingredient})
    } catch (err) {
        sendResourceNotFound(req, res)
    }
})

function sendResourceNotFound(req, res){
    res.status(404).send({
        errors: [
            {
                status: 'Not Found',
                code: '404',
                title: 'Resource does not exist',
                description: `We could not find a ingredient with id: ${req.params.id}`
            }
        ]
    })
}

module.exports = router