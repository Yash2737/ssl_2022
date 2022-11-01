const sslService = require('../services/ssl.service');
const responseHelper = require('../utility/responseHelper');

const sslController = {};

sslController.register = async (req, res) => {
    var response = await sslService.register(req, res);
    responseHelper.sendResponse(response)
}

sslController.getRegisterations = async (req, res) => {
    var response = await sslService.getRegisterations(req, res);
    responseHelper.sendResponse(response)
}

module.exports = sslController;