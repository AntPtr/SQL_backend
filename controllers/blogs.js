const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");

const { Blog } = require('../models')
const { User } = require('../models')
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/tokenext')


const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {  
    let where = {}
    if(req.query.search){
      where = {
         [Op.or] : [
          {
            title: [Op.like] = req.query.search
          },
          {
            author: [Op.like] = req.query.search
          }
        ]
      }
    }
    const notes = await Blog.findAll({
      include: {
        model: User
      },
      where,
      order: [
        ['likes', 'DESC']
      ]
    }) 
    res.json(notes)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)  
        const token = await ReadingList.findByPk(user.id)  
        const blog = await Blog.create({...req.body, userId: token.userId, date: new Date()})
        return res.json(blog)
      } catch(error) {
        next(error)
        return res.status(400).json({ error })
    }
})

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      console.log(req.blog.toJSON())  
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
})

router.delete('/:id',tokenExtractor, blogFinder, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)  
        const token = await ReadingList.findByPk(user.id)
        if(req.blog.userId === token.userId){
            await req.blog.destroy()
        }
        res.status(204).end() 
      } catch(error) {
        next(error)
        return res.status(400).json({ error })
    }
})

router.put('/:id', blogFinder, async (req, res) => {
  if(req.blog){
    await req.blog.set({likes: req.body})
    res.json(req.blog)
  }
  else{
    res.status(404).end()
  }
})

module.exports = router