const User = require('../models/User')

module.exports = async (req, res, next)=>{
    let user = await User.findById(req.user._id)
    if(!user.isStaff){
        res.send({
            errors:[
                {
                    status: 'Forbidden',
                    code: '403',
                    title: 'Sorry, you are not authorized.'
                }
            ]
        })
    } else {
        next()
    }
}