const sslController = require('../../controllers/ssl.controller');

module.exports = router => {
    router.post('/ssl/register', sslController.register);
    router.get('/ssl/registerations', sslController.getRegisterations);
}