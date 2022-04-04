const {ParkingSystem} = require('./parking-lot')
const moment = require('moment')

/**inputs */
let obj = new ParkingSystem()

// console.log(obj.addEntryPoint())

obj.mapParkingSlot([
    [0, 2, 3],
    [2, 0, 2],
    [3, 3, 0],
    [3, 1, 1]
])

obj.setParkingLotSize([1, 2, 3, 1])

obj.parkVehicle({
    size: 2,
    plate: 'xyz12'
})

obj.unparkVehicle(obj.occupiedSlot[0])

obj.parkVehicle({
    size: 2,
    plate: 'xyz123'
})

obj.parkVehicle({
    size: 2,
    plate: 'xyz123'
})

obj.parkVehicle({
    size: 3,
    plate: 'ffasdfasdf'
})

obj.unparkVehicle(obj.occupiedSlot[obj.occupiedSlot.length - 1])

obj.parkVehicle({
    size: 3,
    plate: 'ffasdfasdf',
    time: moment('2022-04-04 15:07:45').format('YYYY-MM-DD HH:mm:ss'),
})

obj.unparkVehicle(obj.occupiedSlot[obj.occupiedSlot.length - 1])


