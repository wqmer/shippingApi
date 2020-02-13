
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


router.post('/Auth', (req, res) => {
    Deftship.auth(req.body).then(result => res.send({ "code": 200, "message": "success", 'data': JSON.parse(result) }))
        .catch(err => {
            console.log(err)
            res.send({ "code": 500, "message": "internal error" })
        })
})

router.post('/Ship', (req, res) => {
    Deftship.create(req.body).then(result => res.send({ "code": 200, "message": "success", 'data': JSON.parse(result) }))
        .catch(err => {
            console.log(err)
            res.send({ "code": 500, "message": "internal error" })
        })
})

router.post('/Rate', (req, res) => {
    Deftship.rate(req.body).then(result => res.send({ "code": 200, "message": "success", 'data': JSON.parse(result) }))
        .catch(err => {
            console.log(err)
            res.send({ "code": 500, "message": "internal error" })
        })
})

router.post('/Label', (req, res) => {
    Deftship.get_label(req.body).then(result => res.send({ "code": 200, "message": "success", 'data': JSON.parse(result) }))
        .catch(err => {
            console.log(err)
            res.send({ "code": 500, "message": "internal error" })
        })
})

router.post('/Void', (req, res) => {
    Deftship.void_label(req.body).then(result => {
        let data = JSON.parse(result)
        if (data.message === "Shipment is voided successfully and refund is made to account") {
            res.send({ "code": 200, "message": "success", 'data': data })
        } else {
            res.status(400).send({ "code": 400, "message": "error", 'data': data })
        }
    })
        .catch(err => {
            console.log(err)
            res.send({ "code": 500, "message": "internal error" })
        })
})




module.exports = router
