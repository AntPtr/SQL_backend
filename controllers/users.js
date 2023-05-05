const router = require('express').Router()
const { Op } = require('sequelize')
const { User, ReadingList } = require('../models')
const { Blog } = require('../models')


router.get('/', async (req, res) => {
  const users = await User.findAll({    
    include: {      
      model: Blog
    }  
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  let readingState = {    
    [Op.in]: [true, false]  
  }  
  if ( req.query.read ) {    
    readingState = req.query.read === "true"  
  }
  const user = await User.findByPk (req.params.id, {    
    include: [     
      {
        model: Blog,
        attributes: { exclude: ['userId']}
      },
      {
        model: Blog,
        as: 'marked_blogs',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        }
      },
      {
        model: ReadingList,
        attributes: { exclude: ['userId', 'blogId']},
        where: {
          readingState
        }
      }
    ] 
  })
  res.json(user)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findByPk(req.params.username)
  if (user) {
    await user.set({
        username: req.params.username
    })
  } else {
    res.status(404).end()
  }
})

module.exports = router