const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === "not a valid email"){
        return response.status(400).send({ error: "Validation isEmail on username failed" })
    }
  
    next(error)
}

module.exports = errorHandler
  