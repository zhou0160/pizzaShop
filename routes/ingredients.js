const sanitizeBody = require('../middleware/sanitizeBody')
const Ingredients = require('../models/Ingredient')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authorization')
const express = require('express')
const router = express.Router()
const ResourceNotFoundError = require('../exceptions/ResourceNotFound')

router.get('/', async (req, res, next) => {
    try{
        let ingredients = await Ingredients.find()
        if(req.query.instock){
            ingredients = ingredients.filter(ingredient => ingredient.quantity > 0)
        }
        res.send({ data: ingredients })
    }catch (err){
        next(err)
    }
})

router.get('/:id', async (req, res,next) => {
    try{
        const ingredient = await Ingredients.findById(req.params.id)

        if(!ingredient) throw new ResourceNotFoundError('Resource not found')
        res.send({ data: ingredient})

    } catch (err) {
        next(err)
    }
})

router.post('/', auth, authAdmin, sanitizeBody, async (req, res, next) => {
    try{
        const newIngredient = new Ingredients(req.sanitizedBody)
        await newIngredient.save()
        res.status(201).send({ data: newIngredient })
    }catch(err){
        next(err)
    }
})

router.patch('/:id', auth, authAdmin, sanitizeBody, async (req, res, next) => {
    try{
        const {_id, ... otherAttributes} = req.sanitizedBody
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
        if (!ingredient) throw new ResourceNotFoundError('Resource not found')
        res.send({ data: ingredient })
    } catch (err){
        next(err)
    }
})

router.put('/:id', auth, authAdmin, sanitizeBody, async (req, res, next) => {
    try{
        const {_id, ...otherAttributes} = req.sanitizedBody
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
        if (!ingredient) throw new ResourceNotFoundError('Resource not found')
        res.send({ data: ingredient })
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', auth, authAdmin, async (req, res, next) => {
    try{
        const ingredient = await Ingredients.findByIdAndRemove(req.params.id)
        if (!ingredient) throw new ResourceNotFoundError('Resource not found')
        res.send({ data: ingredient})
    } catch (err) {
        next(err)
    }
})

module.exports = router