const mongoose = require('mongoose')
const User = require('./User')
const Pizza = require('./Pizza')

const schema = new mongoose.Schema({
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {type: String, trim: true, lowercase: true, enum:['pickup', 'delivery'], default: 'pickup'}, //NEED FURTHER WORK!!!!!
    status: {type: String, trim: true, lowercase: true, enum:['draft', 'ordered', 'paid', 'delivered'], default: 'draft'}, //NEED FURTHER WORK!!!!!
    pizzas: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pizza'}],
    address: {type: String, required: function(){
        return this.type === 'delivery' ? true : false
    }}, 
    price: {type: Number, default: 0},
    deliveryCharge: {type: Number, default: function(){
        return this.type === 'delivery' ? 500 : 0
    }}, //Default here is not clear, based on pickup or delivery
    tax: {type: Number, default: 0},
    total: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
})

schema.pre('save', async function(){
    await this.populate('pizzas').execPopulate()
    this.price = this.pizzas.reduce((acc, item) => acc += item.price, 0)
    this.tax = (this.price + this.deliveryCharge) * 0.13
    this.total = this.price + this.tax
})

module.exports = mongoose.model('Order', schema)