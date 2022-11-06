const sslController = require('../../controllers/ssl.controller');

module.exports = router => {
    router.post('/ssl/register', sslController.register);
    router.get('/ssl/registerations', sslController.getRegisterations);
    router.get('/ssl/dashboard', sslController.getDashboard);
    router.post('/ssl/removePlayer', sslController.removePlayer);
}