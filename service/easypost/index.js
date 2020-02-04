const Easypost = require('@easypost/api');
const api = new Easypost('EZTKbbd59c4c5c9e418c88d60a0f9a1c3af4mnXJ3zNOfSAICBgN3MxJzQ');

/* Either objects or ids can be passed in for addresses and
 * shipments. If the object does not have an id, it will be
 * created. */


const create_order = (request) => {
    let { toAddress, fromAddress, parcels } = request

    return new Promise((resolve, reject) => {
        try {
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
                to_address: toAddress,
                from_address: fromAddress,
                shipments: get_ships(parcels)
            })

            order.save()
                .then(result => resolve(result))
                .catch(error => reject(error))

        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    create_order
}