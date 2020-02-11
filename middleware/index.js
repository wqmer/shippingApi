
const USPS = require('../service/usps')
const getZone = async (req, res, next) => {
    try {
        const data = await USPS.getUspsZonePromise(req.body)
        req.body.zone = data.zone
        next()
    } catch (error) {
        res.status(500).send({ "code": 500, "message": "Error, can't get rating zone",  })
    }
}


module.exports = {
    getZone
}

