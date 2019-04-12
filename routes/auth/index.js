const sanitizeBody = require('../../middleware/sanitizeBody')
const router = require('express').Router()
const User = require('../../models/User')
const authorize = require('../../middleware/auth')
const Authentication_attempts = require('../../models/Authentication_attempts')
const authorization = require('../../middleware/authorization')

router.post('/users', sanitizeBody, async (req, res, next) => {
    new User(req.sanitizedBody)
    .save()
    .then(newUser => res.status(201).send({data: newUser}))
    .catch(next)
})

router.post('/tokens', sanitizeBody, async(req,res, next)=>{
  try{
    const { email, password } = req.sanitizedBody
    const user = await User.authenticate(email, password)
    let didSucceed = false;
  if(user){
    didSucceed = true;
  }
  let attempt = {
    username: email,
    ipAddress: req.ip,
    didSucceed: didSucceed,
    createdAt: new Date()
  }
  new Authentication_attempts(attempt).save()
  if (!user) {
    return res.status(401).send({ errors: [
        {
          status: 'Unauthorized',
          code: '401',
          title: 'Incorrect username or password.'
        }
      ]})
  }
  res.status(201).send({data:{token: user.generateAuthToken()}})
  }catch(err){
    next(err);
  }
})

router.get('/users/me', authorize, async (req, res, next) => {
  try{
    const user = await User.findById(req.user._id)
    res.send({data: user})
  } catch(err){
    next(err)
  }
})

router.patch('/users/me', authorize, sanitizeBody, async (req, res, next)=>{
  try{
    let user = await User.findById(req.user._id)
    user.password = req.sanitizedBody.password
    user.save()
    res.send({data: user})
  } catch(err){
    next(err)
  }
})

router.patch('/users:id', authorize, authorization, sanitizeBody, async(req, res, next)=>{
  try{
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {isStaff: req.sanitizedBody.isStaff},
        {
            new: true,
            runValidators: true
        }
    )
    res.send({data: user})
  } catch(err){
    next(err)
  }
})

module.exports = router