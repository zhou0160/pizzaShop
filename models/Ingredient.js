const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {type: String, required: true, maxlength: 64 },
  price: {type: Number, maxlength: 10000, default: 100},
  quantity: {type: Number, maxlength: 1000, default: 10},
  isGlutenFree: {type: Boolean, default: false},
  imageUrl: {type: String, maxlength: 1024},
  categories: [{type: String, trim: true, lowercase:true, enum: ['meat', 'spicy', 'vegitarian', 'vegan', 'halal', 'kosher', 'cheese', 'seasonings' ]}] // NEED FURTHER WORK!!!!
})

module.exports = mongoose.model('Ingredient', schema)