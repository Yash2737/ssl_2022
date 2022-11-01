const { Router } = require('express')
const apiRouter = new Router();

const setupSSLRoutes = require('./ssl.routes')


setupSSLRoutes(apiRouter);


module.exports = apiRouter