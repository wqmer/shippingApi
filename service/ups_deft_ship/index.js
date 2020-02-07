const request = require('request');


const auth = (request_body) => {
    let obj = {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            'Accept': 'application/json'
        },
        url: 'https://deftship.com/api/authenticate',
        body: JSON.stringify(request_body),
    }
    return new Promise((resolve, reject) => {
        request(obj, (error, response, body) => {
            if (error) reject(error)
            resolve(response.body)
        });
    })
}

const create = (request_body) => {
    // console.log(request_body.access_token)
    let obj = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${request_body.access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'https://deftship.com/api?sandbox/ups/package/ship',
        body: JSON.stringify(request_body),
    }
    return new Promise((resolve, reject) => {
        request(obj, (error, response, body) => {
            if (error) reject(error)
            resolve(response.body)
        });
    })
}


const get_label = (request_body) => {
    // console.log(request_body.access_token)
    let obj = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${request_body.access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'https://deftship.com/api?sandbox/labels',
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
    get_label
}