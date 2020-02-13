
const USPS = require('../service/usps')
const getZone = async (req, res, next) => {
    try {
        let address = {
            to : undefined,
            form : undefined,
        }
        address.from = req.body.from.zipcode
        address.to = req.body.to.zipcode
        const data = await USPS.getUspsZonePromise(address)
        req.body.zone = data.zone
        next()
    } catch (error) {
        res.status(500).send({ "code": 500, "message": "Error, can't get rating zone",  })
    }
}


module.exports = {
    getZone
}

