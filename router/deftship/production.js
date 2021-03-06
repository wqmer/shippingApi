
const PDFDocument = require('pdfkit');
const parseString = require('xml2js').parseString;
const Deftship = require('../../service/ups_deft_ship')

const async = require('async');
const base64 = require('base64topdf');
const uuid = require('uuid')
const base64ToImage = require('base64-to-image');
const request = require('request');

const express = require('express');
const router = express.Router();


router.post('/Ship', (req, res) => {
    Deftship.create(req.body).then(result => res.status(result.statusCode).send({
        "code": result.statusCode,
        "message": result.statusCode == 200 || result.statusCode == 201 ? "success" : 'error',
        'data': JSON.parse(result.body)
    }))
        .catch(err => {
            console.log(err)
            res.status(500).send({ "code": 500, "message": "internal error" })
        })
})

router.post('/Auth', (req, res) => {
    Deftship.auth(req.body).then(result => {
        if (result.statusCode == 200 || result.statusCode == 201) {
            res.status(result.statusCode).send({ "code": result.statusCode, "message": "success", 'data': JSON.parse(result.body) })
        } else {
            res.status(result.statusCode).send({ "code": result.statusCode, "message": "error", 'data': {} })
        }
    })
        .catch(err => {
            console.log(err)
            res.status(500).send({ "code": 500, "message": "internal error" })
        })
})

router.post('/Rate', (req, res) => {
    Deftship.rate(req.body).then(result => {
        if (result.statusCode == 200 || result.statusCode == 201) {
            res.status(result.statusCode).send({ "code": result.statusCode, "message": "success", 'data': JSON.parse(result.body) })
        } else {
            res.status(result.statusCode).send({ "code": result.statusCode, "message": "error", 'data': JSON.parse(result.body) })
        }
    })
        .catch(err => {
            console.log(err)
            res.status(500).send({ "code": 500, "message": "internal error" })
        })
})

router.post('/Label', (req, res) => {
    Deftship.get_label(req.body).then(result => {
        if (result.statusCode == 200) {
            res.status(result.statusCode).send({ "code": result.statusCode, "message": "success", 'data': JSON.parse(result.body) })
        } else {
            res.status(result.statusCode).send({ "code": result.statusCode, "message": "error", 'data': {} })
        }
    })
        .catch(err => {
            console.log(err)
            res.status(500).send({ "code": 500, "message": "internal error" })
        })
})

router.post('/Void', (req, res) => {
    Deftship.void_label(req.body).then(result => {
        let data = JSON.parse(result.body)
        if (data.message === "Shipment is voided successfully and refund is made to account") {
            res.status(result.statusCode).send({ "code": result.statusCode, "message": "success", 'data': data })
        } else {
            res.status(result.statusCode).send({ "code": result.statusCode, "message": "error", 'data': data })
        }
    })
        .catch(err => {
            console.log(err)
            res.send({ "code": 500, "message": "internal error" })
        })
})




module.exports = router
