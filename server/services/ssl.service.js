const logger = require('../utility/logger').logger;
const registerationModel = require('../models/registeration')

const sslService = {};
sslService.getRegisterations = async (req, res) => {
    try {
        var regs = await registerationModel.find({}).sort({ sequence: 1 });
        if (regs?.length > 0) {
            return { statusCode: 200, message: 'Registeration Data', data: regs, res }
        }
        else {
            return { statusCode: 404, message: 'No registerations found', data: '', res }
        }
    } catch (e) {
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
    }
}

sslService.getDashboard = async (req, res) => {
    try {
        var regs = await registerationModel.aggregate([
            {
                '$project': {
                    'sabha': 1, 
                    'memberType': 1, 
                    'onlyPlayer': {
                        '$cond': [
                            {
                                '$eq': [
                                    '$memberType', 'Player'
                                ]
                            }, 1, 0
                        ]
                    }, 
                    'onlySpectator': {
                        '$cond': [
                            {
                                '$eq': [
                                    '$memberType', 'Spectator'
                                ]
                            }, 1, 0
                        ]
                    }
                }
            }, {
                '$group': {
                    '_id': '$sabha', 
                    'countPlayer': {
                        '$sum': '$onlyPlayer'
                    }, 
                    'countSpectator': {
                        '$sum': '$onlySpectator'
                    }
                }
            }
        ]);
        if (regs?.length > 0) {
            return { statusCode: 200, message: 'Registeration Dashboard', data: regs, res }
        }
        else {
            return { statusCode: 404, message: 'No registerations found', data: '', res }
        }
    } catch (e) {
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
    }
}

sslService.register = async (req, res) => {
    try {
        const { name, emailId, mobileNo, sabha, sports } = req.body
        const id = await playerExists(emailId, mobileNo);
        if (id == 0) {
            var lastId = await getLastSSLId();
            var user = await createPlayerEntry(req.body,lastId);
            if (user) {
                return { statusCode: 200, message: 'Register Successful', data: user, res }
            }
            else {
                logger.error(user);
                return { statusCode: 500, message: 'Error registering player', data: '', res }
            }
        }
        else {
            return { statusCode: 401, message: 'EmailId or MobileNo already exists', data: '', res }
        }
    } catch (e) {
        logger.error('Registeration ERror ',e);
        console.log("error", e);
        return { statusCode: 500, message: 'Internal Server Error', data: '', res, error: e }
    }
}

const getLastSSLId = async (body) => {
    try {
        const player = await registerationModel.findOne({}, { sequence: 1 }).sort({ sequence: 'descending' });
        if(player.sequence) {
            return player.sequence
        }
        return 0;
    } catch (error) {
        return null;
    }
}

const createPlayerEntry = async (body,lastId) => {
    try {
        body.sequence = (lastId+1);
        const player = await registerationModel.create(body);
        return player;
    } catch (error) {
        return null;
    }
}

const playerExists = async (emailId, mobileNo) => {
    try {
        var player = await registerationModel.findOne({
            $or: [{ 'emailId': emailId }, { 'mobileNo': mobileNo }]
        }, { id: 1 });
        if (player != null) {
            return player.id;
        }
        return 0;
    } catch (error) {
        return 0;
    }
}

module.exports = sslService;