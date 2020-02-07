const Easypost = require('@easypost/api');


/* Either objects or ids can be passed in for addresses and
 * shipments. If the object does not have an id, it will be
 * created. */


const create_order = (request) => {
    let { api_key, carrier, service, fromAddress, toAddress, parcels, customsInfo } = request
    const api = new Easypost(api_key);
    return new Promise((resolve, reject) => {
        try {
            const get_custom_items = (item, index) => {
                let custom_item = new api.CustomsItem({ ...item.customs_items[index] })
                let obj =  { ...customsInfo, customs_items: [custom_item] }
                return new api.CustomsInfo(obj)
            }

            // const get_ships = (parcels) => parcels.map(item , index => new api.Shipment({ parcel: item, customs_info: new api.CustomsInfo(obj) }))
            const get_ships = (parcels) => parcels.map( (item , index) => new api.Shipment({ parcel: item, customs_info: get_custom_items(customsInfo , index) }))
            const from_Address = new api.Address({ ...fromAddress });
            const to_Address = new api.Address({ ...toAddress });
            const order = new api.Order({
                to_address: to_Address,
                from_address: from_Address,
                shipments: get_ships(parcels),

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