/**
 * 00 Parking Lot

You were hired by XYZ Corp. to implement a parking allocation system for their new malling complex, the Object-Oriented Mall.
The new parking system will pre-assign a slot for every vehicle coming into the complex. No vehicle can freely choose a parking
slot and no vehicle is reserved or assigned a slot until they arrive at the entry point of the complex. The system must assign
a parking slot the satisfies the following constraints:

1. There are initially three (3) entry points, and can be no less than three (3), leading into the parking complex. A vehicle
  must be assigned a possible and available slot closest to the parking entrance. The mall can decide to add new entrances later.

2. There are three types of vehicles: small (S), medium (M) and large (L),
  and there are three types or parking slots: small (SP), medium (MP) and large (LP).

  (a) S vehicles can park in SP, MP and LP parking spaces;
  (b) M vehicles can park in MP and LP parking spaces; and
  (c) L vehicles can park only in LP parking spaces.

3. Your parking system must also handle the calculation of fees, and must meet the following pricing structure:

  (a) All types of car pay the flat rate of 40 pesos for the first three (3) hours;
  (b) The exceeding hourly rate beyond the initial three (3) hours will be charged as follows:

      - 20/hour for vehicles parked in SP;
      - 60/hour for vehicles parked in MP; and
      - 100/hour for vehicles parked in LP

      Take note that exceeding hours are charged depending on parking slot size regardless of vehicle size.

      For parking that exceeds 24 hours, every full 24 hour chunk is charged 5,000 pesos regardless of parking slot.
      The remainder hours are charged using the method explained in (b).

      Parking fees are calculated using rounding up method, e.g. 6.5 hours must be rounded to 7.

  (c) A vehicle leaving the parking complex and returning within one hour must be charged continuous rate,
      i.e. the vehicle must be considered as if it did not leave. Otherwise, rates must be implemented as described.

You are free to design the system in any pattern you wish. However, take note that the system assumes the input of the following:

  (a) The number of entry points to the parking complex, but no less than three (3). Assume that the entry points
      are also exit points, so no need to take into account the number of possible exit points.

  (b) The map of the parking slot. You are welcome to introduce a design that suits your approach. One suggested
      method, however, is to accept a list of tuples corresponding to the distance of each slot from every entry
      point. For example, if your parking system has three (3) entry points. The list of parking spaces may be
      the following: [(1,4,5), (3,2,3), ...], where the integer entry per tuple corresponds the distance unit
      from every parking entry points (A, B, C).

  (c) The sizes of every corresponding parking slot. Again, you are welcome to introduce your own design. We suggest using
      a list of corresponding sizes described in integers: [0, 2, 1, 1, ...] where 0, 1, 2 means small, medium and large
      in that order. Another useful design may be a dictionary of parking sizes with corresponding slots as values.

  (d) Two functions to park a vehicle and unpark it. The functions must consider the attributes of the vehicle as described above.
      When the unpark function is called, it must also return how much the vehicle concerned is charged.

Please develop in either ReacJS or NodeJS. You will be required to explain your approach during the interview. Have fun!

 */

import { vehicleInfo } from "./model/vehicleInfo"

const moment = require('moment')

export class ParkingSystem {
    /**
    *  (b) The map of the parking slot. You are welcome to introduce a design that suits your approach. One suggested
     method, however, is to accept a list of tuples corresponding to the distance of each slot from every entry
     point. For example, if your parking system has three (3) entry points. The list of parking spaces may be
     the following: [(1,4,5), (3,2,3), ...], where the integer entry per tuple corresponds the distance unit
     from every parking entry points (A, B, C).
    */
    parkingSlot : Array<any> = []

    /**
     * (a) The number of entry points to the parking complex, but no less than three (3). Assume that the entry points
      are also exit points, so no need to take into account the number of possible exit points.
     */
    entryPoint = new Array(3)

    /**
     * (c) The sizes of every corresponding parking slot. Again, you are welcome to introduce your own design. We suggest using
      a list of corresponding sizes described in integers: [0, 2, 1, 1, ...] where 0, 1, 2 means small, medium and large
      in that order. Another useful design may be a dictionary of parking sizes with corresponding slots as values.
     */
    slotSizes : Array<number> = []

    /**
     *  Another useful design may be a dictionary of parking sizes with corresponding slots as values.
     * smallest  to biggest
     */
    sizes : Array<number> = [1, 2, 3]

    /**
     * vacantSlot and occupiedSlot should be equall in total of slotSizes or parkingSlot
     */
    vacantSlot: Array<any> = []
    occupiedSlot: Array<any> = []
    billChargeLogs = []

    constructor() {
    }



    /**
     * Parking fees are calculated using rounding up method, e.g. 6.5 hours must be rounded to 7.
     */
    timeDiff = (time: string) => {
        const byMinutes = Math.abs(moment(time).diff(moment(), 'minutes'))
        const hours = byMinutes / 60
        return Math.round(hours)
    }

    /**
     * 3. Your parking system must also handle the calculation of fees, and must meet the following pricing structure:
    
      (a) All types of car pay the flat rate of 40 pesos for the first three (3) hours;
      (b) The exceeding hourly rate beyond the initial three (3) hours will be charged as follows:
    
          - 20/hour for vehicles parked in SP;
          - 60/hour for vehicles parked in MP; and
          - 100/hour for vehicles parked in LP
    
          Take note that exceeding hours are charged depending on parking slot size regardless of vehicle size.
    
          For parking that exceeds 24 hours, every full 24 hour chunk is charged 5,000 pesos regardless of parking slot.
          The remainder hours are charged using the method explained in (b).
    
          Parking fees are calculated using rounding up method, e.g. 6.5 hours must be rounded to 7.
    
      (c) A vehicle leaving the parking complex and returning within one hour must be charged continuous rate,
          i.e. the vehicle must be considered as if it did not leave. Otherwise, rates must be implemented as described.
    
     */
    calculateCharge :any = (hrs: number, vehicleInfo: vehicleInfo)  => {
        /**
         * Take note that exceeding hours are charged depending on parking slot size regardless of vehicle size.
         */
        const {
            sizeCategory
        } = vehicleInfo

        let threeBeyond = 40
        let computation = `
        \tHours: ${hrs},
        \tFirst Three Hours: ${threeBeyond}
    `
        if (hrs <= 3) {
            return {
                charge: threeBeyond,
                computation
            }
        }
        const dayCharge = (totalHours: number, hrMultiplier: number, dayMultiplier = 5000) => {
            const days = +Math.abs(totalHours / 24).toFixed()
            const costPerDay = days * dayMultiplier
            const costPerHr = totalHours * hrMultiplier
            const firstThreeHrCost = Math.abs((3 * hrMultiplier) - threeBeyond)
            const charge = totalHours >= 3 ? (costPerDay + costPerHr) - firstThreeHrCost : costPerDay + costPerHr
            computation = `
            \tHours: ${totalHours},
            \tPer Hour Cost: ${hrMultiplier},
            \tCost Per Day: ${costPerDay},
            \tCost Per Hour: ${costPerHr},
            \tDeduction From First Three Hours: (3 * ${hrMultiplier} - ${threeBeyond}) = ${firstThreeHrCost},
        `

            return {
                charge,
                computation
            }

        }
        switch (sizeCategory) {
            case this.sizes[0]:
                return dayCharge(hrs, 20)
            case this.sizes[1]:
                return dayCharge(hrs, 60)
            case this.sizes[2]:
                return dayCharge(hrs, 100)
        }
    }

    addEntryPoint = () => {
        this.entryPoint.length += 1
        return this.entryPoint
    }

    mapParkingSlot = (slotStructure : Array<any> = []) => {
        /**
         * by using this function will reset the vacantSlot and occupiedSlot
         * [
            [1, 2, 3],
            [2, 1, 2],
            [3, 2, 1]
        ]
         */
        let entryPointsAllocated = slotStructure.every((x: Array<Object>) => x.length === this.entryPoint.length)
        if (entryPointsAllocated && slotStructure.length > 0) {

            this.vacantSlot = []
            this.occupiedSlot = []

            slotStructure.forEach((slot, index) => this.vacantSlot.push({
                index,
                info: slot
            }))

            return this.parkingSlot = slotStructure
        }
        console.error('Wrong Format')
    }

    setParkingLotSize = (slotSizes : Array<number> = []) => {
        let slotSizesValid = slotSizes.every(slot => this.sizes.includes(slot))
        const validLength = (slotSizes.length === this.parkingSlot.length) && slotSizes.length > 0

        if (validLength && slotSizesValid) {
            /**
             * by using this function will modify vacantSlot adding object of 'sizeCategory
             * assuming occupiedSlot is empty array 
             * [1, 2, 3, 1]
             */
            slotSizes.forEach((sizes, slotIndex) => {
                this.vacantSlot[slotIndex]['sizeCategory'] = sizes
            })
            return this.slotSizes = slotSizes
        }
        console.error('Wrong Size for the given slots')

    }

    setSlotSizes = (sizes  : Array<number> = []) => {
        sizes = sizes.sort()
        if (sizes.length > 0 && sizes.length < 3) {
            return this.sizes = sizes
        }
        console.log('Invalid size length')
    }

    /**
     * 1. There are initially three (3) entry points, and can be no less than three (3), leading into the parking complex. A vehicle
      must be assigned a possible and available slot closest to the parking entrance. The mall can decide to add new entrances later.
    
     * @param {*} vehicleInfo 
     */
    parkVehicle = (vehicleInfo: vehicleInfo) => {
        const vehicleHasSize = vehicleInfo?.size !== undefined
        const slotSizeValid = this.slotSizes.length > 0 && this.slotSizes.length || false
        const parkingLotSizeValid = this.parkingSlot.length > 0 && this.parkingSlot.length || false
        const validSlotsAndParkingSize = (slotSizeValid && parkingLotSizeValid) && (slotSizeValid === parkingLotSizeValid)
        if (vehicleHasSize && this.sizes.includes(vehicleInfo.size) && validSlotsAndParkingSize) {

            if (this.parkingSlot.length === (this.vacantSlot.length + this.occupiedSlot.length)) {

                const {
                    size: vehicleSize,
                    plate: vehiclePlate
                } = vehicleInfo
                let entryPointClosestIndex : Array<any> = []
                let sizeCategory : number = NaN
                this.sizes.forEach((size, sizeIndex) => {
                    let closestDistance : any

                    if (vehicleSize === size) sizeCategory = sizeIndex
                    this.vacantSlot.forEach((slot, vacantIndex) => {
                        if (closestDistance === undefined) closestDistance = {
                            ...slot,
                            vacantIndex,
                            value: slot.info[sizeIndex]
                        }
                        else closestDistance = closestDistance.info[sizeIndex] > slot.info[sizeIndex] ? {
                            ...slot,
                            vacantIndex,
                            value: slot.info[sizeIndex]
                        } : {
                            ...closestDistance,
                            value: closestDistance.info[sizeIndex]
                        }
                    })
                    entryPointClosestIndex.push(closestDistance)
                })

                /**
                 * 2. There are three types of vehicles: small (S), medium (M) and large (L),
                    and there are three types or parking slots: small (SP), medium (MP) and large (LP).
    
                    (a) S vehicles can park in SP, MP and LP parking spaces;
                    (b) M vehicles can park in MP and LP parking spaces; and
                    (c) L vehicles can park only in LP parking spaces.
    
                 */
                const small = 0,
                    medium = 1,
                    large = 2
                let parkAt
                switch (sizeCategory) {
                    case 0:
                        parkAt = entryPointClosestIndex.sort((a, b) => {
                            if (a.value < b.value) return -1
                            if (a.value > b.value) return 1
                            else return 0
                        })[0]
                        break;

                    case 1:
                        parkAt = entryPointClosestIndex[medium] > entryPointClosestIndex[large] ? entryPointClosestIndex[large] : entryPointClosestIndex[medium]
                        break;

                    case 2:
                        parkAt = entryPointClosestIndex[large]
                        break;

                    default:
                        break;
                }

                let entryPayload = {
                    ...this.vacantSlot[parkAt.vacantIndex],
                    vehicleInfo,
                    time: vehicleInfo?.time && moment(vehicleInfo.time) || moment().format('YYYY-MM-DD HH:mm:ss') //ignore past time as for testing purposes
                }
                let vacantInfo = this.vacantSlot[parkAt.vacantIndex]
                let hasDuplicateOccupied = this.occupiedSlot.some(slot => slot.vehicleInfo.plate === vehiclePlate) && this.occupiedSlot.length > 0

                if (hasDuplicateOccupied) {
                    console.log('Has Duplicate entry', vehicleInfo)
                    return
                }

                if (vacantInfo?.vehicleInfo?.plate !== vehiclePlate) delete entryPayload.charge

                if (entryPayload && entryPayload.charge) {
                    let timeDiff = this.timeDiff(entryPayload.unparkTime)
                    /**
                     *  (c) A vehicle leaving the parking complex and returning within one hour must be charged continuous rate,
                    i.e. the vehicle must be considered as if it did not leave. Otherwise, rates must be implemented as described.
                    */
                    if (timeDiff > 1) delete entryPayload.charge

                }
                this.occupiedSlot.push(entryPayload)
                this.vacantSlot.splice(parkAt.vacantIndex, 1)

            }
            return
        }
        console.error('Provide a size key with correct value')
    }

    unparkVehicle = (info: vehicleInfo) => {
        /**
         * (c) A vehicle leaving the parking complex and returning within one hour must be charged continuous rate,
          i.e. the vehicle must be considered as if it did not leave. Otherwise, rates must be implemented as described.
         */
        const {
            vehicleInfo,
            time
        } = info
        const occupiedIndex = this.occupiedSlot.findIndex(x => x.vehicleInfo.plate === vehicleInfo.plate)
        let timeDiff
        if (info?.vehicleInfo?.time) {
            timeDiff = this.timeDiff(info.vehicleInfo.time)
        } else timeDiff = this.timeDiff(info.time)

        let {
            charge,
            computation
        } = this.calculateCharge(timeDiff, info)

        if (this.occupiedSlot?.[occupiedIndex]?.charge > 0) {
            charge -= this.occupiedSlot[occupiedIndex].charge
            computation += `\tDeduction From Last Park: ${this.occupiedSlot[occupiedIndex].charge}`
        }
        console.log(`Charge of ${vehicleInfo.plate} with size of ${vehicleInfo.size} : ${charge} \n${computation}`)
        const unparkPayload = {
            ...this.occupiedSlot[occupiedIndex],
            charge,
            computation,
            unparkTime: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        if (occupiedIndex !== -1) {
            this.vacantSlot.push(unparkPayload)
            this.occupiedSlot.splice(occupiedIndex, 1)
        }
    }

    getChargeLogs = () => {
        return this.billChargeLogs
    }

}
