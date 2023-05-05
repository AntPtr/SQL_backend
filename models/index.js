const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')
const TokensSession = require('./tokensSessions')


User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'marked_blogs' })
Blog.belongsToMany(User, { through: ReadingList, as: 'marked_users' })

module.exports = {
  Blog,
  User,
  ReadingList,
  TokensSession
}