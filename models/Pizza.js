const mongoose = require('mongoose')
const Ingredient = require('./Ingredient')

const schema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 4, maxlength: 64},
    price: {type: Number, minlength: 1000, maxlength: 10000, default:1000},
    size: {type: String, trim:true, lowercase:true, enum:['small', 'medium', 'large', 'extra large'], default: 'small'}, // NEED FURTHER WORK!!!!
    isGlutenFree: {type: Boolean, default: false},
    imageUrl: {type: String, maxlength: 1024},
    ingredients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}],
    extraToppings: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient'}]
})

schema.pre('save', async function(){
    await this.populate('ingredients extraToppings').execPopulate()
    this.price = [...this.ingredients, ...this.extraToppings].reduce((acc, item) => acc += item.price, 0)
})

module.exports = mongoose.model('Pizza', schema)