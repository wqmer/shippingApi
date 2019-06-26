// const phantom = require('phantom');
// const createOrder = require('./uility/api').createOrder
const uuid = require('uuid')
const request = require('request');
const async = require('async');
const fs = require('fs');
const extend = require('extend');
const base64 = require('base64topdf');
const convert = require('convert-units')
const moment = require('moment')
const config = require('./service/config')
const USPS = require('usps-webtools');
var md5 = require('md5');



// const date = new Date();
// console.log(new Date(date.getTime() + (24*60*60*1000)).toISOString())
// var myjson = { '123' : '123'}
// var mystring = '123'
// console.log((myjson + mystring).toString())
const myJson = 
{
  "instructionList": [
      {
          "channelCode": "UpsGround",
          "userOrderNumber": "5296000000587938---20190625888296",
          "remark": "",
          "sender": {
              "contactName": "NC",
              "telephone": "5412545474",
              "countryCode": "US",
              "state": "NC",
              "city": "Raleigh",
              "street": "2434 Bertie Drive",
              "street1": "",
              "street2": "",
              "county": "",
              "zipCode": "27610",
              "zip4": ""
          },
          "recipient": {
              "contactName": "Lisa Thompson",
              "telephone": "6627926425",
              "countryCode": "US",
              "state": "MS",
              "city": "West",
              "street": "2071 Attala Road#3009",
              "street1": "",
              "street2": "",
              "county": "",
              "zipCode": "39192",
              "zip4": ""
          },
          "packageDetailList": [
              {
                  "packageRecord": {
                      "sonOrderNumber": "",
                      "boxNumber": "",
                      "weight": 0.23,
                      "length": 1,
                      "width": 1,
                      "height": 1
                  },
                  "itemList": [
                      {
                          "productName": "891914284586850",
                          "productNameEn": "891914284586850",
                          "productSku": "",
                          "hsCode": 1,
                          "quantity": "1",
                          "unitPrice": "891914284586850",
                          "unitWeight": 0.23
                      }
                  ]
              }
          ]
      }
  ]
}
const myString =  JSON.stringify(myJson)

// var result = myString.slice(1,-1);
// console.log(result)
var readytoMd5 =  myString + "/xoU5d/d7a+xDOboQmiOx/xsVRYuiOE8PfSH6OSl" + "2019-06-26 13:15:00"
console.log(readytoMd5)

console.log(md5(readytoMd5));

// class Carrier {
//       password = 0 ;
//       constructor(password) {
//             this.password = password ;
//       }

//       auth(){
//            let authObj = '123'
//            return authObj
//       }

//       ship(){
//         // console.log(auth())
//         // console.log('it works from ship ' + this.name + ' ' + args)
//       }

//       varifyAddress(){
//         console.log('it works from varify')
//       }

//       tracking(){
//         console.log('it works from tracking')
//      }
// }



// let ups = new Carrier('usps')
// ups.ship('myargs')


// let s = {"code":200,"list":{"TrackingNo":"YMAF20190613000026","OrderID":"ab90bab8-b427-49f5-a8d9-1dd19d7cedb8","Price":0,"pdf":"http://121.41.114.118:8181/pdfxz/20190613/H20190613122036449310.pdf"}}
// let t  = JSON.stringify(s)

// console.log(JSON.parse(t))
// let label = "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovQ291bnQgMQovS2lkcyBbMTggMCBSXQo+PgplbmRvYmoKNCAwIG9iagpbL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSV0KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvTWFjUm9tYW5FbmNvZGluZwo+PgplbmRvYmoKNiAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EtQm9sZAovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhLU9ibGlxdWUKL0VuY29kaW5nIC9NYWNSb21hbkVuY29kaW5nCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkT2JsaXF1ZQovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvQ291cmllcgovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjEwIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0NvdXJpZXItQm9sZAovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjExIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0NvdXJpZXItT2JsaXF1ZQovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjEyIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0NvdXJpZXItQm9sZE9ibGlxdWUKL0VuY29kaW5nIC9NYWNSb21hbkVuY29kaW5nCj4+CmVuZG9iagoxMyAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1Sb21hbgovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjE0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL1RpbWVzLUJvbGQKL0VuY29kaW5nIC9NYWNSb21hbkVuY29kaW5nCj4+CmVuZG9iagoxNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1JdGFsaWMKL0VuY29kaW5nIC9NYWNSb21hbkVuY29kaW5nCj4+CmVuZG9iagoxNiAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9UaW1lcy1Cb2xkSXRhbGljCi9FbmNvZGluZyAvTWFjUm9tYW5FbmNvZGluZwo+PgplbmRvYmoKMTcgMCBvYmogCjw8Ci9DcmVhdGlvbkRhdGUgKEQ6MjAwMykKL1Byb2R1Y2VyIChGZWRFeCBTZXJ2aWNlcykKL1RpdGxlIChGZWRFeCBTaGlwcGluZyBMYWJlbCkNL0NyZWF0b3IgKEZlZEV4IEN1c3RvbWVyIEF1dG9tYXRpb24pDS9BdXRob3IgKENMUyBWZXJzaW9uIDUxMjAxMzUpCj4+CmVuZG9iagoxOCAwIG9iago8PAovVHlwZSAvUGFnZQ0vUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwgL1Byb2NTZXQgNCAwIFIgCiAvRm9udCA8PCAvRjEgNSAwIFIgCi9GMiA2IDAgUiAKL0YzIDcgMCBSIAovRjQgOCAwIFIgCi9GNSA5IDAgUiAKL0Y2IDEwIDAgUiAKL0Y3IDExIDAgUiAKL0Y4IDEyIDAgUiAKL0Y5IDEzIDAgUiAKL0YxMCAxNCAwIFIgCi9GMTEgMTUgMCBSIAovRjEyIDE2IDAgUiAKID4+Ci9YT2JqZWN0IDw8IC9GZWRFeEdyb3VuZCAyMCAwIFIKL0dyb3VuZEcgMjEgMCBSCi9iYXJjb2RlMCAyMiAwIFIKPj4KPj4KL01lZGlhQm94IFswIDAgMjg4IDQzMl0KL1RyaW1Cb3hbMCAwIDI4OCA0MzJdCi9Db250ZW50cyAxOSAwIFIKL1JvdGF0ZSAwPj4KZW5kb2JqCjE5IDAgb2JqCjw8IC9MZW5ndGggMjQ5MAovRmlsdGVyIFsvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGVdIAo+PgpzdHJlYW0KR2F0VTY/I3J1VSZVZzkkcmUlNkEhYFgvOlwoISFkMl1FOkdYS2AnUVpDQChjU0FlKEAvbDZRP2guMiQ2Kl9Ecy40aD4pbVBHK1d0YyszIi4KWF1CcjglU19zODRxcFBRPlI4PjxSQjVANDtwPTg7cyNNSEtgYVtTKj9TKWEoZTMoWihRJiFkJW4uIj4kMkwqWTMlaXFlZzpMQjM/QihibWUKJkA7NFVARTtSS186VSNlY1YiUS8xcEhNPy1hRU5YMEZxTyc0YVsub2RIWShzal9CbTBpZ1NtXD02P15kXV9xRF9yRmZrPVplKzZnWTksLGcKM0NEMiJeR2s9X3AqIksrcl1iSUQ7OmdsRDQjYXEjJkFrNGElK29GYzVfRXEsL0VZcThQP140Kicmc1c1RG40MTBCJVRaNSxNQXRPXGUpUTkKIW8qOjduK2pmSTFJSUJUOktqQj5IaURqK0tEJlNTU3RCTz5bL2MsL1MxVWdbYys4NXVib2NAUE9QUG82bzoyWD1jWzIoQ2pvXmFZcGBzVW4KOmlRIzFbQiIkLmpvY1lFXk9Fa0xGanRlTzRUOkwoNTJDZFJBRmIkP0knRGxbaihpOWRtZGtWdGlnRGgsazFxWFA7bW0mYiw5YHJGJF1lVGIKKjIhNitSRyFMT2Upam9LM1NUQlhXJUo/ITdxOyxWbVcnOiFobE83aEchL2c2OjNebzByU2JyX3J0dEEqXmEnbCNnTWNPdVVZIztgTzVIPiIKS0BMVVttOVtJZlY2b0RPZyRJTTFvQDo8J1l1SS9vYmZTZ01GRWEkdUdeT09AY0JrRyFiSTlQbXFPQj9wOWkxWkVfb0U6N1AsSmoxW2xGTkMKR1FKKnFVcnNqcEkvW1s1PltJSSJiTjhjdFVpYChkNGF0JUlUIS1BW187WHQnND5CPz1rNEVKJG8lbFFaXUkxNmFdMHQnSjZKYFI7cSJqLmEKVDw9JVpaV2MxOU8lI3IwRjExNlthUU48XS9zJVY6Km80J3VIWFhpZW9mNTohazNtXU0wWTo0QGZPVGovXyVCWy9cYnIhN01fZ2ljMVoqXSMKOVdtNSpzODJCYG8xdSI4UyJuO2Y1QG47Qi1SbSFxNUttZ2stVCpWbzgtcztCQlVPXlArcnNQTUtyTDZKWD1RPE41anRkL1lPPiZTMFA8byMKNW9NVj9IP0dXMVg7Q1s+UjBWW2koJ3A0VHFZQyxpOGklZyMnOjBeXk5rbTVEQTA7a0clSCRJO2VtT0c1TlduM2VAYzxDZyxsQW9KRUVKUWsKJWs9SF5sbDteLDAsSD90KUNocl1EalQpNUlzdWxZbWpvLTdiTzpiP0JLTVFDcVdePkcva0JzSkRlYW5FZjchUWhUaCFOMT9ENUNRUHBQKjMKZDM3XXJoWWNxUE9bRVRHUVw/KjczOkdnYDF0QXVBQDI+IVhJJTFBVyxrbDpmSVhKQFpJdDc/MzYrS08/Lj9uOGJOTkVSSylwXzBiXm9pbzsKcCxiby0vQEo0UEw1bWBBRypIMWNpMGs0OEkqR207JCxfMTw2NEwoSmpJPURKJVpYajVab0RPMl8+QVE1MV1uXyZQMVBQSjhSazpXXiVAVz8KaWpxSkpYcDlgQktjaWcjMGRsQXEyN1BxajVcKDlcX1NnOUAnS1NRNERVPEwiO3ArcmlNQ3FjUGwqYUhBQWpiTSVCQUFaOjZqVCdkazZhI1wKOyg2XWY1PilEXjZnLSFXXDVBcVpFRzkzQCxqWzNeOlQyKT0kM2QkRC1tYVlHIyxlXk5lRF5bPCFEMVB0QENEOjwmbzo/VilgSHA2I2wna18KUWw1aFksLWM/NilWaCJFT0MqQydXLyVgKm1RI0tMKVxpXzFDS1lacCdcQERbKCxtWStDW0ckL1RVZW8sSEVQV1M3WVMoZUdvLktVXE9QPF0KVyVEbWQtcidHb1FCJzZLQ2YjajtOZEVbdGJBXGlDKEplW29LO1N1ZD9PYiswNC1UIU5lL0AySzwxNzkmL1A5K1BNSG5WcUM0S2cpU0IrZGAKYEdZUGlAbE5yJiEoWE1VbTZsWE87WHU8blo9KnFzL0VOby8sKWVyO2RdV09QaTM2MUoxaUZOcSE5U0xdNj8zOGkoZ2RSYVU2T0NON3FlJ3EKR0dcUiFrYUdhKT8nSWNCVlBTYjEuUSwiPTpJZ0NIV2E2NCZGPUQ/dClWaFAuRy5NIiZHdCZNbT8xMlFbVVxmXlo8NkB0MjdSVTYmPzEyUVsKVUg5YyxuI0QmQi06Rj4wNEopV2E5OytfdGoyK1JeU1FKWyQkVDlQN25dN0hpNGM4LScnZW9lMVBzVkhQNkRCIklMPUdtUCJ1ZSlURiVKIiMKVSotaztSbE9bMVcpVSEiYlYiVDhvaGY0Q1QzQzBXUGdvQzpoYVIqQzs7MCMhJGU9UFFLVUBqcTomWFw1IV85KDI9NzkvXTZSKD84WmMqQF0KaDsjaV5wNkgjUV07c0VdOCM2aksrS1ssJF9ma2RNPjJaV0xZUHRSJyxwUlgmRGQociM6b21yb1VAbUxvVSRFPUNFKTtFaDMwbGBdVE5GYEsKOyJta2YiVisxPnAjIVIlTUpmV1wnSm1PJS5DL1VqIiVnZTUpT0JnaTxzcCI2T3VlVWU9amBQNT86OkNkJVNPZStfJy0jbjkmNFNLIiEhUzgKWTRaYWk4TmYvZUZjLiJwLy87cE9MVS5WMW9cSjphIiEhU0hbZV9bLURvSHRiXGpadUhRTF9IVjZfJnVzUHRVPiQ8ISsqa2FEYCtIWUBSYy0KXFBET2BXdG1aRUwkR3F1KFNlamYmR09MTiRRTSRzJiwhbUFcaE9GO2ssdSYiXmVsUGM+SF9qaHBbWyhLOz1mVz4rY2UhP1RjaTEqWGk2OlYKcy5hbTZHcyVjNGNNJmJuVGwmU2BsJyx1PExCYzRXallqQl9GYlNDYmwiS2NaL20jcmJEKzo5QVozP18hNCM4T0FeW19UUWg+WCc3PCptdSQKLE5PTlVsamYmYWhBV3RucSlHQ14rJCMwLDhpITVaWUFDLzUyODpdSmBlZlV0YW4xO3IqVC1oR1ouO19vakFZXTgwQkQ4RjZTWkcjWlRqaUEKMS5fQW8nOGZJTC1fR0c7cFVyVF49Yl8wQmtuUi87XTZrLitTIVNeUkohdFNlSEYpPzg8Uk5wck9CY2Y5QVVKRi5fNFlpWG0tPlY+b2E7NW8KM19cX01ZWixQTFxRPU50USE5KikzS2MuZUh1ZmJcYEMkOixBbnJxZkorOlQuXitscmhuL0tpO01WQX4+CmVuZHN0cmVhbQplbmRvYmoKMjAgMCBvYmoKPDwgL1R5cGUgL1hPYmplY3QKL1N1YnR5cGUgL0ltYWdlCi9XaWR0aCAxMTgKL0hlaWdodCA0NwovQ29sb3JTcGFjZSAvRGV2aWNlR3JheQovQml0c1BlckNvbXBvbmVudCA4Ci9MZW5ndGggNDUwCi9GaWx0ZXIgWy9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZV0KPj5zdHJlYW0KR2IiL2VKSV1SPyNYbkxnVDY8ZGYvSS4mP0I9aGNEYWctckQ0XTAlUGZNVForYFFTSStKXUNeJnJEM0E4bE04bm5GRlAhSS5mKmpZQzJUblsKPDdpKDdcPEpIITx1VnVtM0hKZms8OCkrJVpOKk1mLXMlbD5WWlVDcyw5YDlvVyZUTSUvY2dtSlUlLmZMaGJJJCc+Qmd1X2lAUStDJmJXcjYKM0RDTTYvRlVNdCxEQl4sKlIwMHMiXVdGR0MwajojV2E0Z1c8KlFlVDssPztCUyFvcnU1dSRfM0IyalwyQy4nYi5GWHFAWDFBKixhXFNhR0oKOm5Na2NJUVwuSmY6MDU3Xy1MNEo8JTJRTW1JYW9AXDg4RktHYjFwLG1XOyUuSE5DLjtWLitgZClzOnJCaFVqTEhCWDJSQ145X3E4MW5WW0sKTD0yUUJGdDtyVENuNltmcG1wcjdTX2NHIWRXWyxzWDErKzhSPCktJUZjVS5rUnBXUylYRTs5Kzs0bFMrXzZBc3JjRWJRTGNJRWNfOyVNS0UKM2NqR1Q5Kk5bSi5wTjJXbUk4Vz8kbDtjNl01ZC8/cDh0PHNFYUoyZXJsK34+CmVuZHN0cmVhbQplbmRvYmoKMjEgMCBvYmoKPDwgL1R5cGUgL1hPYmplY3QKL1N1YnR5cGUgL0ltYWdlCi9XaWR0aCA1NAovSGVpZ2h0IDU0Ci9Db2xvclNwYWNlIC9EZXZpY2VHcmF5Ci9CaXRzUGVyQ29tcG9uZW50IDgKL0xlbmd0aCAxOTYKL0ZpbHRlciBbL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlXQo+PnN0cmVhbQpHYiIwTzN1Mz5oJHEvTTBKKCVTNyxLdVk8LXMubEgtJ3FFUyhwUk9IQ3JQbiQ3WjkpYTYiTFInUyNvQzU6IkVsaEwkMjMlMj86XydsY1kvdAo5JkM0L05Ack9bW0UnamJgcz5cOlBwam01PEMsTT0mWDtvLEFRam1mYWtKbUckMERwVDxgL1dIQ0lLZGg4cDwwa0kyP2FhVWlJTDFXMyJDIQo2RGQ2NmwsPldeSFtmLj0kKXJMblRpU2ZJNDNAOUk8V34+CmVuZHN0cmVhbQplbmRvYmoKMjIgMCBvYmoKPDwgL1R5cGUgL1hPYmplY3QKL1N1YnR5cGUgL0ltYWdlCi9XaWR0aCAyOTQKL0hlaWdodCA1NQovQ29sb3JTcGFjZSAvRGV2aWNlR3JheQovQml0c1BlckNvbXBvbmVudCA4Ci9MZW5ndGggMTExOQovRmlsdGVyIFsvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGVdCj4+c3RyZWFtCkdiIi9jZDw2S2EjWGVGZlQ7RXRSbFVqaylQRic6N0BHNVUzRCdRdTE6JXBqS2x1VmN0b0NWWTsvM05DYXAjRyhCVSJLNU5lQWxYW2hvRlNkCj1JYmszOlYmYGEyJD8qKzMuSytKajVJOT1LX09AWkMzdWhLZiJZbV9Nbz0uRD4iViJPa20+OV9JXyx0NFRNcGE8bV5jJTAhQD4kTkhwUTwmClxxSDRFZSVbNSYzO2phRzxiZks5U0BWIVpCZHFsOGAncz9RayZxdGc/PGEhbVNoLW0nYCZmXnE3Oz1dMGZfSSgkIWg2MXAsJUYodC1PVUVFCmZ1T15oIUtKYi5WMCY4K2VEKm8pVmZkaks8S3BZY2dYOlc3PmopVEdTVlsqKExrNDczNl9HLFhuLmVoPTdCYSt0RENxXV1vRiRublVubFVfCkdDSUExV0RIIidNM1E/bjxVS2IpNlc3I2RoWDFoOkJVRC1pMDhcOWRWLDpCXl8oTVJcb0dhJFAiSCZ0a05bPVgqUiVqZlhMUV91VSJNalhoCjhGO1RjN0A4OysuRXVNSzBrTT8hZ0FGNWZWNTg5cFAlc189WjJvW01cQmRqNSVXTV1nOzMuRWRdJmxRMD05UFk6OSE9STdPPjpEVnBuY3VBCidnQVNNQCRmOz5cay9tTF10ZSNHTVQ7JDVpT0pnNUUnNXMvNyYuVysxMVhqdEJNJG8jRDYkcXNdYWc6cVNdMk9KUWRTZEM4VnQhUiU0YTUuCkBiZyQ9YS0wMVlmKEglSkw9QTBiXnQ9ayxUXjMvQ1dDXkg5ZSE0JSpaZ2pPK0FoS3BWRkhfbHEjaDpkczY/P1YkXmlIUnU+TCVzSW8kMjgmCiRacT1AciU3S15YcllZWjYtVDJjMydmYmo2cjAvdDtZaEQrY0lDV2Q7OS9uV1U+UU9JRSRnInIiP1R1Z1dZYlRaOj1MXVhBUlIhczRsb19WCixFWG5KXG49Wk0uOiZgK2Bfc0pjOSwjRUJicE9dYHErRCpZSGEoJG4vSTAwbyttaDchNUZxUkYkU0YkOi9aIzpjTnRNRmxDXWdBYS4pODktCiwucGIzLio0N2JKbiteN2Zab1InTitSNzxVQlJuO11tYmZhQTtPNl49XDs/TyhGW2ZBSjFwN1wnRTVxI2FIamxRZkNHX0A2b21NbmUxJzAxCjQlcTE3UE5ZXVE7aig9MWpCUTZLJi9EaTAvdT5DZE9jam5UJDNLUV5lZkpEUWE9U2BPcXJqPGw6XStmQWpiImZpXTE3c05CY0NiJEArTTMxCkVfN21aVjAmOVYmYlIrTCIvUytjXSNERDNuQTdhSldtR3EyVUUtJT9Na2pDXyI8T3NBLiFeQmMvTGQzIkRsNU0mUGE5YUc5I1k9UypUUDQrCiw4cGBrbjNNS0o5Y19HJ1BLZSpCO29EYEMlTmd0TEZYbVdLcC1qaDRUQVpGVTk1LGpSLz5bZC9KLFRHSiJBcy5+PgplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCAyMwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTA0IDAwMDAwIG4gCjAwMDAwMDAxNjIgMDAwMDAgbiAKMDAwMDAwMDIxNCAwMDAwMCBuIAowMDAwMDAwMzEyIDAwMDAwIG4gCjAwMDAwMDA0MTUgMDAwMDAgbiAKMDAwMDAwMDUyMSAwMDAwMCBuIAowMDAwMDAwNjMxIDAwMDAwIG4gCjAwMDAwMDA3MjcgMDAwMDAgbiAKMDAwMDAwMDgyOSAwMDAwMCBuIAowMDAwMDAwOTM0IDAwMDAwIG4gCjAwMDAwMDEwNDMgMDAwMDAgbiAKMDAwMDAwMTE0NCAwMDAwMCBuIAowMDAwMDAxMjQ0IDAwMDAwIG4gCjAwMDAwMDEzNDYgMDAwMDAgbiAKMDAwMDAwMTQ1MiAwMDAwMCBuIAowMDAwMDAxNjIyIDAwMDAwIG4gCjAwMDAwMDE5OTkgMDAwMDAgbiAKMDAwMDAwNDU4MSAwMDAwMCBuIAowMDAwMDA1MjE3IDAwMDAwIG4gCjAwMDAwMDU1OTggMDAwMDAgbiAKdHJhaWxlcgo8PAovSW5mbyAxNyAwIFIKL1NpemUgMjMKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjY5MDQKJSVFT0YK"
     
// let decodedBase64 = base64.base64Decode(label, 'SjgFO6iYpTJ9hyFz.pdf');


// const usps = new USPS({
//     server: 'http://production.shippingapis.com/ShippingAPI.dll',
//     userId: '849XUEHU5746',
//     ttl: 10000 //TTL in milliseconds for request
//   });

//   usps.verify({
//     street1: 'PO BOX 135',
//     street2: '',
//     city: 'CASSEL',
//     state: 'CA',
//     zip: '96016-0135'
//   }, function(err, address) {
//     console.log(address);
//   });

// console.log(convert(16).from('oz').to('lb'))
// const a = {x : 1}
// const b = {y : 2}
// const c = extend(a,b)
// console.log(c)
// console.log( typeof ( moment().add(1,'days').format( "YYYY-MM-DDTHH:MM:SS").toString() ))
// console.log( moment().format( "YYYY-MM-DDTHH:MM:SS"))

// var soap = require('strong-soap').soap;
// var url = 'http://hfapiserver.hofdl.com?wsdl'  ;
// var StrPlaceName = '深圳'
// var isytle = '3'

// var url = 'http://www.webservicex.net/stockquote.asmx?WSDL';
 
// var requestArgs = {
//     APIKey:'A8BE7F3E7325EC62BE70E77343498B39',
// };
 
// var options = {};
// soap.createClient(url, options, function(err, client) {
//     if(err) console.log(err)
//     console.log(client)
    //  console.log(client)
//   var method = client['GetChannelList']
//   method(requestArgs, function(err, result, envelope, soapHeader) {
//     //response envelope
//     console.log('Response Envelope: \n' + envelope);
//     //'result' is the response body
//     console.log('Result: \n' + JSON.stringify(result));
//   });
// });
// var soap = require('soap');
// soap.createClient(url, function(err, client) {
//     if(err)console.log(err)
//     client.GetChannelList( requestArgs,function(err, result) {
//         console.log(JSON.stringify(result));
//     });
// });

//     PNG = require('pngjs').PNG;

    // var data = fs.readFileSync('test.png');
    // var png = PNG.sync.read(data);  
    // console.log(png)


//     const PDFDocument = require('pdfkit');
//     const doc = new PDFDocument;

//     doc.pipe(fs.createWriteStream('outputNew.pdf'));

//     doc.addPage()
//        .image('./test.png', {
//         fit: [500,400],
//         align: 'center',
//         valign: 'center'
// });

    // doc.image('blank.png', {
    //     fit: [800, 1200],
    //     align: 'center',
    //     valign: 'center'
    //  });
    // //  doc.addPage()
    //  doc.end();
   



    // const HummusRecipe = require('hummus-recipe');
    // const pdfDoc = new HummusRecipe('new', 'output-new.pdf');
    // pdfDoc.createPage('A4')
    // pdfDoc.image('test.png',1,1  ,
    //     { width: 300, keepAspectRatio: true}
    // )
    // .endPage()
    // // end and save
    // .endPDF();

// const pdfDoc = new HummusRecipe('output-new.pdf', 'output.pdf');
// pdfDoc
//     // edit 1st page
//     .editPage(1)
//     // .text('example-sku', 80, 1100 , {   color: '066099' ,   fontSize: 60,  })
//     // .rectangle(20, 20, 40, 100)
//     // .comment('Add 1st comment annotaion', 200, 300)
//     .image('test.png', 5, 3,{width: 200, height: 100})
//     .endPage()
//     // edit 2nd page
//     // .editPage(2)
//     // .comment('Add 2nd comment annotaion', 200, 100)
//     // .endPage()
//     // end and save
//     .endPDF();

    // const pdfDoc = new HummusRecipe('input.pdf', 'output.pdf');
// console.log(pdfDoc.metadata);

// const pdfDoc = new HummusRecipe('input.pdf', 'output.pdf');
// const longPDF = 'test.pdf';
// pdfDoc
//     // // just page 10
//     // .appendPage(longPDF, 10)
//     // // page 4 and page 6
//     // .appendPage(longPDF, [4, 6])
//     // // page 1-3 and 6-20
//     // .appendPage(longPDF, [[1, 3], [6, 20]])
//     // all pages
//     .appendPage(longPDF)
//     .endPDF();


// let order = 
// {
// 	"authorization": {
// 		"token": "f665224bd2a2b27565f17d4ed0bb13cd",
// 		"key": "f665224bd2a2b27565f17d4ed0bb13cdb342919df05b1ab44d9c160456827169"
// 	},
// 	"order": {
// 		"shippingMethodCode": "PK0006",
// 		"referenceNumber": "ck1231132132123123",
// 		"orderWeight": 0.5
// 	},
// 	"recipient": {
// 		"recipientName": "recipientName",
// 		"recipientAddress1": "recipientAddress1",
// 		"recipientCity": "recipientCity",
// 		"recipientProvince": "recipientProvince",
// 		"recipientPostCode": "recipientPostCode",
// 		"recipientCountryCode": "US",
// 		"recipientTelephone":"2155880271"
// 	},
// 		"shipper": {
// 		"shipperName": "TestByKimi",
// 		"shipperCountrycode": "US",
// 		"shipperProvince": "CA",
// 		"shipperCity": "Irvine",
// 		"shipperStreet": "shipperStreet",
// 		"shipperPostcode": "92606",
// 		"shipperTelephone": "63312345"
// 	},

// 	"declarationArr": [{
// 		"declareEnName": "NewTestByKimi",
// 		"declareQuantity": 1,
// 		"declareWeight": 3,
// 		"declareValue": 4,
// 		"declareCurrencycode": "USD",
// 		"sku": "PBK"
// 	}]
// }

// // createOrder(order)



// var concurrencyCount = 0; 
// // fetchUrl 模拟创建订单
// // var fetchUrl = function (url, callback) {
// //   var delay = parseInt((Math.random() * 10000000) % 10000, 10);//模拟创建订单耗时
// //   concurrencyCount++;
// //   console.log('现在的并发数是', concurrencyCount, '，正在生产订单的是', url, '，耗时' + delay + '毫秒');
// //   setTimeout(function () {
// //     concurrencyCount--;
// //     callback(null, url + ' 订单内容');
// //   }, delay);
// // };


// var createOrder = (order , callback) =>{
//     request({
//         method: 'POST',
//         headers: { "content-type": "application/json"},
//         url:     'http://119.23.188.252/api/v1/orders/service/create',
//         body:   JSON.stringify(order)
//       }, function(error, response, body){
//         callback(null,response.body);
//       }); 
// }

// var Orders = [];
// for(var i = 0; i < 300; i++) {
//     let order = 
//     {
//         "authorization": {
//             "token": "f665224bd2a2b27565f17d4ed0bb13cd",
//             "key": "f665224bd2a2b27565f17d4ed0bb13cdb342919df05b1ab44d9c160456827169"
//         },
//         "order": {
//             "shippingMethodCode": "PK0006",
//             "referenceNumber": `${uuid()}`,
//             "orderWeight": 0.5
//         },
//         "recipient": {
//             "recipientName": "recipientName",
//             "recipientAddress1": "recipientAddress1",
//             "recipientCity": "recipientCity",
//             "recipientProvince": "recipientProvince",
//             "recipientPostCode": "recipientPostCode",
//             "recipientCountryCode": "US",
//             "recipientTelephone":"2155880271"
//         },
//             "shipper": {
//             "shipperName": "TestByKimi",
//             "shipperCountrycode": "US",
//             "shipperProvince": "CA",
//             "shipperCity": "Irvine",
//             "shipperStreet": "shipperStreet",
//             "shipperPostcode": "92606",
//             "shipperTelephone": "63312345"
//         },
    
//         "declarationArr": [{
//             "declareEnName": "NewTestByKimi",
//             "declareQuantity": 1,
//             "declareWeight": 3,
//             "declareValue": 4,
//             "declareCurrencycode": "USD",
//             "sku": "PBK"
//         }]
//     }
//   Orders.push(order);
// }

// async.mapLimit(Orders, 200, function (order, callback) {
//    createOrder(order, callback);
// }, function (err, result) {
//   console.log('final');
//   console.log(result);//模拟返回订单信息
// });




// (async function() {
//   const instance = await phantom.create();
//   const page = await instance.createPage();
//   await page.on('onResourceRequested', function(requestData) {
//   console.info('Requesting', requestData.url);
//   });

//   const status = await page.open('https://stackoverflow.com/');
//   const content = await page.property('content');
//   const result = await page.render('stackOverFlow.pdf')
//   console.log(content);

//   await instance.exit();
// })();

// var phantom = require('phantom');   
// phantom.create().then(function(ph) {
//     ph.createPage().then(function(page) {
//         page.open("http://www.google.com").then(function(status) {
//             page.render('google.pdf').then(function() {
//                 console.log('Page Rendered');
//                 ph.exit();
//             });
//         });
//     });
// });
// let a = {b : 1}
// let b = [1,23,4]
// console.log(Array.isArray(b))



// var querystring = require('querystring');
// var request = require('request');

// var form = {
//      key : "bf6759d9e27e27975dc660b83ac924a4"
// };

// // var formData = querystring.stringify(form);
// // console.log(formData)
// // var contentLength = formData.length;

// request({
//     // headers: {
//     // //   'Content-Length': contentLength,
//     //      'Content-Type': 'application/pdf'
//     // },
//     url: 'http://150.109.55.134:8089/order/FastRpt/PDF_NEW.aspx?Format=A4_EMS_BGD.frx&PrintType=1&order_id=279372',
//     method: 'POST'
//   }, function (err, res, body) {
//     console.log('http://150.109.55.134:8089' + res.headers.location)
//     //it works!
// });



// var options = { method: 'POST',
//   url: 'http://apis.juhe.cn/lottery/types',
//   headers: 
//    {  'Content-Type': 'application/x-www-form-urlencoded' },
//   form: { key: 'bf6759d9e27e27975dc660b83ac924a4' } };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });
