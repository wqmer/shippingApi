const Easypost = require('@easypost/api');


/* Either objects or ids can be passed in for addresses and
 * shipments. If the object does not have an id, it will be
 * created. */


const create_order = (request) => {
    let { api_key, carrier, service, fromAddress, toAddress, parcels, customsInfo } = request
    const api = new Easypost(api_key);
    return new Promise((resolve, reject) => {
        try {

            // const get_custom_items = (item) => {
            //     let array = []
            //     if( Array.isArray( item.customs_items )){
            //         item.customs_items.forEach(item => {
            //             array.push(new api.CustomsItem({ ...item }))
            //         })
            //         return array
            //     }else{
            //         return []
            //     }  
            // }

            const get_custom_items = (item) => {
                if (Array.isArray(item.customs_items)) {
                    return  ( item.customs_items.map(item => new api.CustomsItem({ ...item })) )
                } else {
                    return []
                }
            }


            let customs_info = undefined
            let obj = undefined
            if (customsInfo) {
                let customs_items_array = get_custom_items(customsInfo)
                obj = { ...customsInfo, customs_items: customs_items_array }
            }

            const get_ships = (parcels) => parcels.map(item => new api.Shipment({ parcel: item, customs_info: new api.CustomsInfo(obj) }))
            
            // const get_ships = (parcels) => {
            //     let array = []
            //     parcels.forEach(item => {
            //         array.push(
            //             new api.Shipment({
            //                 parcel: item,
            //                 customs_info: new api.CustomsInfo(obj)                        
            //             }))
            //     })
            //     return array
            // }

            // const object = { ...customsInfo, customs_items: get_custom_items(customsInfo) }
            // console.log(object)

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