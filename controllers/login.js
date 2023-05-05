const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { User, TokensSession } = require('../models')
const { tokenExtractor } = require('../util/tokenext')


router.post('/login', async (request, response) => {
    const { username, password } = request.body
  
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
      ? false
      : password === 'secret'
  
    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }
  
    const userForToken = {
      username: user.username,
      id: user._id,
    }
  
    const token = jwt.sign(userForToken, process.env.SECRET)

    await TokensSession.create({
      userId: user.id,
      token: token
    })
  
    response
      .status(200)
      .send({ token, username: user.username, name: user.name })
})

router.delete('/logout', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)    
    const blog = await TokensSession.destroy({
      where: { userId :  User.id }
    })
    
  } catch(error) {
    next(error)
    return res.status(400).json({ error })
}
})
  
module.exports = router