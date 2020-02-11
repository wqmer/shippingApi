const request = require('request');


const url = {
    product: {
        auth: 'https://deftship.com/api/authenticate',
        create: 'https://deftship.com/api/ups/package/ship',
        rate: 'https://deftship.com/api/ups/package/rating',
        label: 'https://deftship.com/api/labels',
        void: 'https://deftship.com/api/void',
    },
    sandbox: {
        create: 'https://deftship.com/api/ups/package/ship?sandbox',
        rate: ' https://deftship.com/api/ups/package/rating?sandbox',
        label: 'https://deftship.com/api/labels?sandbox',
        void: 'https://deftship.com/api/void?sandbox',
    },
}

const auth = (request_body) => {
    let obj = {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            'Accept': 'application/json'
        },
        url: url.product.auth,
        body: JSON.stringify(request_body),
    }
    return new Promise((resolve, reject) => {
        request(obj, (error, response, body) => {
            if (error) reject(error)
            resolve(response.body)
        });
    })
}

const create = (request_body, isTest = false) => {
    // console.log(request_body.access_token)
    let obj = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${request_body.access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: isTest ? url.sandbox.create : url.product.create,
        body: JSON.stringify(request_body),
    }
    return new Promise((resolve, reject) => {
        request(obj, (error, response, body) => {
            if (error) reject(error)
            resolve(response.body)
        });
    })
}

const rate = (request_body, isTest = false) => {
    // console.log(request_body.access_token)
    let obj = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${request_body.access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: isTest ? url.sandbox.rate : url.product.rate,
        body: JSON.stringify(request_body),
    }
    return new Promise((resolve, reject) => {
        request(obj, (error, response, body) => {
            if (error) reject(error)
            resolve(response.body)
        });
    })
}

const get_label = (request_body, isTest = false) => {
    // console.log(request_body.access_token)
    let obj = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${request_body.access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: isTest ? url.sandbox.label : url.product.label,
        body: JSON.stringify(request_body),
    }
    return new Promise((resolve, reject) => {
        request(obj, (error, response, body) => {
            if (error) reject(error)
            resolve(response.body)
        });
    })
}

const void_label = (request_body, isTest = false) => {
    // console.log(request_body.access_token)
    let obj = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${request_body.access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: isTest ? url.sandbox.void : url.product.void,
        body: JSON.stringify(request_body),
    }
    return new Promise((resolve, reject) => {
        request(obj, (error, response, body) => {
            if (error) reject(error)
            resolve(response.body)
        });
    })
}

module.exports = {
    auth,
    create,
    get_label,
    void_label,
    rate,   
}