const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 14
const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator')

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        maxlength: 64,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 64,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase:true,
        maxlength: 512,
        required: true,
        unique: true,
        set: value => value.toLowerCase(),
        validate: {
            validator: value => validator.isEmail(value),
            message: props => `${props.value} is not a valid email address.`
        }
    },
    password: {
        type: String,
        trim: true,
        maxlength: 70,
        required: true
    },
    isStaff: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

schema.plugin(uniqueValidator, {
    message: props =>
        props.path === 'email' ?
        `The email address '${props.value}' is already registerd.` :
        `The ${props.path} must be unique. '${props.value}' is already in use.`
})

schema.methods.generateAuthToken = function () {
    return jwt.sign({
        _id: this._id
    }, 'superSecureSecret')
}

schema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({
        email: email
    })
    const hashedPassword = user ?
        user.password :
        `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
        
    const passwordDidMatch = await bcrypt.compare(password, hashedPassword)

    return passwordDidMatch ? user : null
}

schema.methods.toJSON = function() {
    const obj = this.toObject()
    delete obj.password
    delete obj.__v
    return obj
}

schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
})

schema.post('findByIdAndUpdate', function(doc, next){
    doc.save();
    next();
})

const Model = mongoose.model('User', schema)

module.exports = Model