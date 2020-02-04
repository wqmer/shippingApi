const Easypost = require('@easypost/api');


/* Either objects or ids can be passed in for addresses and
 * shipments. If the object does not have an id, it will be
 * created. */


const create_order = (request) => {
    let { api_key, carrier, service, fromAddress, toAddress, parcels } = request
    const api = new Easypost(api_key);
    return new Promise((resolve, reject) => {
        try {
            const from_Address = new api.Address({ ...fromAddress });
            const to_Address = new api.Address({ ...toAddress });

            const get_ships = (parcels) => {
                let array = []
                parcels.forEach(item => {
                    array.push(
                        new api.Shipment({
                            parcel: item
                        }))
                })
                return array
            }
            const order = new api.Order({
                to_address: to_Address,
                from_address: from_Address,
                shipments: get_ships(parcels)
            })

            order.save()
                .then(result => {
                    api.Order.retrieve(result.id).then(order => {
                        order.buy(carrier, service).then(result => resolve(result))
                            .catch(error => reject(error))
                    });
                })
                .catch(error => reject(error))
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    create_order
}