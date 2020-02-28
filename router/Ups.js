
const PDFDocument = require('pdfkit');
const parseString = require('xml2js').parseString;
const UPS = require('../service/ups')

const async = require('async');
const request = require('request');

const express = require('express');
const router = express.Router();


router.post('/Middleware', async (req, res) => {
    try {
        let result = await UPS.do_request(req.body)
        res.status(result.statusCode).send(JSON.parse( result.body))
    } catch (error) {
        console.log(error)
        res.status(500).send({ "code": 500, "message": "internal error" })
    }
})





module.exports = router