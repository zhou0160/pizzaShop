const debug = require('debug')('sanitize:body')
const xss = require('xss')
const sanitize = soursestring => {
    return xss(soursestring, {
        whiteList: [],
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    })
}

const stripTages = payload => {
    const {
        id,
        _id,
        ...attributes
    } = payload
    
    for (let key in attributes) {
        if (attributes[key] instanceof Array) {
            attributes[key] = attributes[key].map(element => {
                return typeof element === 'string' ? sanitize(element) : stripTages(element)
            })
        } else if (attributes[key] instanceof Object) {
            attributes[key] = stripTages(attributes[key])
        } else {
            attributes[key] = sanitize(attributes[key])
        }
    }
    
    return attributes
}

module.exports = (req, res, next) => {

    const sanitizedBody = stripTages(req.body)
    req.sanitizedBody = sanitizedBody

    next()
}