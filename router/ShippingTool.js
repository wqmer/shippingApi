const express = require('express');
const UPS_YI = require('../service/ups_yi')
const TOOL = require('../service/tool')
const PDFDocument = require('pdfkit');
const parseString = require('xml2js').parseString;

const UPS = require('../service/ups')
const USPS = require('../service/usps')
const FEDEX = require('../service/fedex')
const CHUKOULA = require('../service/chukoula')
const ENDICIA = require('../service/usps_endicia')

const async = require('async');
const base64 = require('base64topdf');
const uuid = require('uuid')
const request = require('request');
const router = express.Router();
const _ = require('lodash')


//---跳转至快递100单号信息查询，自适应判断运单号 顺丰，UPS,USPS,FEDEX,DHL
router.get('/trackingAndShow/:id', (req, res) => {
   let num = req.params.id
   TOOL.detectCarrier(num).then(result => {
      if (result === 'sf-express') result = 'shunfeng'
      res.redirect(`https://www.kuaidi100.com/chaxun?com=${result}&nu=${num}`)
   })
      .catch(err => console.log(err))
})

//---UPS地址验证
router.post('/verifyAddressUPS', (req, res) => {
   try {
      let {
         addressList
      } = req.body
      async.mapLimit(addressList, 25, function (address, callback) {
         UPS.verifyAddressUPS(address, callback);
      }, function (err, result) {
         res.send({
            result: result
         });
      });
   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }

})

//---USPS地址验证
router.post('/verifyAddressUSPS', (req, res) => {
   try {
      // service.varifyAddress().then(result => res.send(result)).catch(err => console.log(err))
      let {
         addressList
      } = req.body
      async.mapLimit(addressList, 25, function (address, callback) {
         USPS.varifyAddress(address, callback);
      }, function (err, result) {
         // console.log(result)
         // res.json(result)
         res.send({
            result: result
         });
      });

   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }

})

//--判断地址是否可以投递
router.post('/isDeliverable', (req, res) => {
   try {
      let {
         addressList
      } = req.body
      async.mapLimit(addressList, 25, function (address, callback) {
         UPS.verifyAddressUPS(address, callback);
      }, function (err, result) {
         var undeliverable_address = result.filter(item => item.deliverable == 'false').map(item => item.referenceNumber)
         var deliverable_address = result.filter(item => item.deliverable == 'true').map(item => item.referenceNumber)
         res.send({
            result: {
               undeliverable: undeliverable_address,
               deliverable: deliverable_address
            }
         });
      });

   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }

})

//--邮政区域查询
router.post('/zoneLookUp', (req, res) => {
   try {
      let {
         Zone_Pairs
      } = req.body
      async.mapLimit(Zone_Pairs, 25, function (record, callback) {
         USPS.getUspsZone(record, callback);
      }, function (err, result) {
         if (err) console.log(err)
         // res.json(result)
         res.send({
            result: result
         });
      });
   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }

})

//--邮政区域查询，并返回对应订单号
router.post('/zoneLookUpNew', (req, res) => {
   try {
      let {
         Zone_Pairs
      } = req.body
      async.mapLimit(Zone_Pairs, 25, function (record, callback) {
         USPS.getUspsZoneUpdate(record, callback);
      }, function (err, result) {
         if (err) console.log(err)
         // res.json(result)
         res.send({
            result: result
         });
      });

   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }

})

//--ups查询跟踪信息
router.post('/trackingUps', (req, res) => {
   let {
      parcels
   } = req.body
   // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
   try {
      async.mapLimit(parcels, 25, function (parcel, callback) {
         UPS.TrackingUPS(parcel, callback);
      }, function (err, result) {
         if (err) console.log(err)
         // console.log(result)
         // res.json(result)
         res.send({
            result: result
         });
      });

   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }
})

//--ups获取报价
router.post('/getRateUps', (req, res) => {
   UPS.GetRate(req.body).then(result => res.send(result))
   .catch(error => res.send({
      "code": 500,
      "message": "internal error"
   }))
})
//--ups判断地址类型
router.post('/getAddressType', (req, res) => {
   UPS.GetAddressType(req.body).then(result => res.send(result))
      .catch(error => res.send({
         "code": 500,
         "message": "internal error"
      }))
})

//--UPS获取服务时效
router.post('/inTransitTimeUps', (req, res) => {
   let {
      Postcode_Pairs
   } = req.body
   // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
   try {
      async.mapLimit(Postcode_Pairs, 25, function (record, callback) {
         UPS.GetUpsInTransitTime(record, callback);
      }, function (err, result) {
         if (err) console.log(err)
         // console.log(result)
         // res.json(result)
         res.send({
            result: result
         });
      });
   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }

})

//--UPS获取运单物流状态
router.post('/getUpsTrackingStatus', (req, res) => {
   try {
      let {
         trackings
      } = req.body
      // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
      async.mapLimit(trackings, 25, function (tracking, callback) {
         UPS.GetUpsTrackingStatus(tracking, callback);
      }, function (err, result) {
         if (err) console.log(err)
         var created_array = result.filter(item => item.status == 'created').map(item => item.trackingNo)
         var intransit_array = result.filter(item => item.status == 'in transit').map(item => item.trackingNo)
         var devlivery_array = result.filter(item => item.status == 'delivered').map(item => item.trackingNo)
         var no_information_array = result.filter(item => item.status == 'no information').map(item => item.trackingNo)

         res.send({
            result: {
               created: created_array,
               in_transit: intransit_array,
               delivery: devlivery_array,
               no_information: no_information_array,
            }
         });
      });

   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }
})

//--Fedex获取运单物流状态
router.post('/getFedexTrackingStatus', (req, res) => {
   try {
      let {
         trackings
      } = req.body
      // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
      async.mapLimit(trackings, 25, function (tracking, callback) {
         let track_req = { 'trackingNumber': tracking }
         FEDEX.getTracking(track_req, callback);
      }, function (err, result) {
         if (err) console.log(err)
         let filter_data =
            _.chain(result)
               .groupBy(function (item) {
                  if (Array.isArray(item.data.DatesOrTimes)) {
                     let type_name = item.data.DatesOrTimes[0].Type
                     if (type_name == "ACTUAL_DELIVERY") return 'Delivery'
                     if (type_name == "ANTICIPATED_TENDER") return 'Created'
                     return 'In_Transit'
                  } else {
                     return 'No_Information'
                  }
               })
               .mapValues(array => array.map(item => item.trackingNo))
               .value()

         res.send({
            result: {
               created: filter_data['Created'],
               in_transit: filter_data['In_Transit'],
               delivery: filter_data['Delivery'],
               no_information: filter_data['No_Information'],
            }
         });
         // res.send('ok')
      });
   } catch (error) {

      res.send({
         "code": 500,
         "message": "internal error"
      });
   }
})

//--FEDEX验证地址
router.post('/verifyAddressFEDEX', (req, res) => {
   try {
      let {
         addresList
      } = req.body
      async.mapLimit(addresList, 25, function (address, callback) {
         FEDEX.addressValidation(address, callback);
      }, function (err, result) {
         if (err) console.log(err)
         res.send({
            result: result
         });
      });

   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }
})

//FedEx 获取物流信息
router.post('/trackShipmentFEDEX', (req, res) => {
   try {
      let {
         parcels
      } = req.body
      // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
      async.mapLimit(parcels, 100, function (address, callback) {
         FEDEX.getTracking(address, callback);
      }, function (err, result) {
         if (err) console.log(err)
         res.send({
            result: result
         });
      });

   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }
})

//FedEx 获取燃油比例
router.get('/getFuelSurcharegeFEDEX', (req, res) => {
   try {
      let args = [
         { method: "FEDEX_GROUND" },
         { method: "FEDEX_2_DAY" },
      ]
      async.mapLimit(args, 25, function (record, callback) {
         FEDEX.getFuelSurcharge(record, callback);
      }, function (err, result) {
         if (err) console.log(err)
         res.send({
            result: result
         });
      });
   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }
})

//判断是否住宅地址
router.post('/isResidentialFedex', (req, res) => {
   try {
      let {
         addresList
      } = req.body
      async.mapLimit(addresList, 25, function (address, callback) {
         FEDEX.isResidential(address, callback);
      }, function (err, result) {
         if (err) console.log(err)
         res.send({
            result: result
         });
      });
   } catch (error) {
      res.send({
         "code": 500,
         "message": "internal error"
      });
   }
})

//fedex预估邮费
router.post('/getRateFEDEX', (req, res) => {
   try {
      let {
         args
      } = req.body
      // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
      async.mapLimit(args, 25, function (arg, callback) {
         FEDEX.getRates(arg, callback);
      }, function (err, result) {
         if (err) console.log(err)
         // console.log(result)
         // res.json(result)
         res.send({ result: result });
      });

   } catch (error) {
      res.send({ "code": 500, "message": "internal error" });
   }
})

//fedex判断计费区域
router.post('/getRateZoneFedex', (req, res) => {
   try {
      let {
         Zone_Pairs
      } = req.body


      // Reference_No = [ "1676941641013" , "1645030501014" , "1677061012013"]
      async.mapLimit(Zone_Pairs, 25, function (zone_pair, callback) {
         let request_arg = {
            "referenceNumber": zone_pair.referenceNumber,
            "shipMethod": "FEDEX_GROUND",
            "Fpostcode": zone_pair.from ? zone_pair.from : '',
            "Fcountry": "us",
            "Spostcode": zone_pair.to ? zone_pair.to : '',
            "Scountry": "us",
            "Weight": "17",
         }
         // console.log(request_arg)
         FEDEX.getZone(request_arg, callback);
      }, function (err, result) {
         console.log(result)
         // if (err) console.log(err)
         // console.log(result)
         // res.json(result)
         res.send({ result: result });
      });

   } catch (error) {
      res.send({ "code": 500, "message": "internal error" });
   }
})






module.exports = router