const router = require('express').Router()
const { tokenExtractor } = require('../util/tokenext')

const { ReadingList } = require('../models')
const { User } = require('../models')


router.post('/', (req, res) => {
    if(req.body){
       const list = ReadingList.create({
            userId: req.body.userId,
            blogId: req.body.blogId,
            readingState: false,
        })
        res.json(list)
    } else {
        res.status(400)
    }
})

router.put('/:id', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)    
        const rlist = await ReadingList.findByPk(req.params.id)
        if( rlist.userId === user.id){
            await rlist.set({
                readingState: req.body.read
            })
        }
        return res.json(rlist)
      } catch(error) {
        return res.status(400).json({ error })
    }
})

module.exports = router 