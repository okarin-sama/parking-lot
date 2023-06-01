const moment = require("moment");

const ParkingSystem = function () {
  /**
     *  (b) The map of the parking slot. You are welcome to introduce a design that suits your approach. One suggested
      method, however, is to accept a list of tuples corresponding to the distance of each slot from every entry
      point. For example, if your parking system has three (3) entry points. The list of parking spaces may be
      the following: [(1,4,5), (3,2,3), ...], where the integer entry per tuple corresponds the distance unit
      from every parking entry points (A, B, C).
     */
  this.parkingSlot = [];

  /**
     * (a) The number of entry points to the parking complex, but no less than three (3). Assume that the entry points
      are also exit points, so no need to take into account the number of possible exit points.
     */
  this.entryPoint = new Array(3);

  /**
     * (c) The sizes of every corresponding parking slot. Again, you are welcome to introduce your own design. We suggest using
      a list of corresponding sizes described in integers: [0, 2, 1, 1, ...] where 0, 1, 2 means small, medium and large
      in that order. Another useful design may be a dictionary of parking sizes with corresponding slots as values.
     */
  this.slotSizes = [];

  /**
   *  Another useful design may be a dictionary of parking sizes with corresponding slots as values.
   * smallest  to biggest
   */
  this.sizes = [1, 2, 3];

  /**
   * vacantSlot and occupiedSlot should be equall in total of slotSizes or parkingSlot
   */
  this.vacantSlot = [];
  this.occupiedSlot = [];
  this.billChargeLogs = [];
};

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
ParkingSystem.prototype.calculateCharge = function (hrs, sizeCategory) {
  debugger;
  const threeBeyond = 40;
  if (hrs <= 3) return threeBeyond;
  const dayCharge = (totalHours, hrMultiplier, dayMultiplier = 5000) => {
    const days = +Math.abs(totalHours / 24).toFixed();
    const excessHours = (totalHours - days) * 24;
    const costPerDay = days * dayMultiplier;
    const costPerExcess = excessHours * hrMultiplier;
    return totalHours >= 3
      ? costPerDay + costPerExcess - Math.abs((3 * hrMultiplier) - threeBeyond)
      : costPerDay + costPerExcess;
  };
  switch (sizeCategory) {
    case this.sizes[0]:
      return dayCharge(hrs, 20);
    case this.sizes[1]:
      return dayCharge(hrs, 60);
    case this.sizes[2]:
      return dayCharge(hrs, 100);
  }
};

ParkingSystem.prototype.addEntryPoint = function () {
  this.entryPoint.length += 1;
  return this.entryPoint;
};

ParkingSystem.prototype.mapParkingSlot = function (slotStructure = []) {
  /**
     * by using this function will reset the vacantSlot and occupiedSlot
     * [
        [1, 2, 3],
        [2, 1, 2],
        [3, 2, 1]
    ]
     */
  const entryPointsAllocated = slotStructure.every(
    (x) => x.length === this.entryPoint.length
  );
  if (entryPointsAllocated && slotStructure.length > 0) {
    this.vacantSlot = [];
    this.occupiedSlot = [];

    slotStructure.forEach((slot, index) =>
      this.vacantSlot.push({
        index,
        info: slot,
      })
    );

    return (this.parkingSlot = slotStructure);
  }
  console.error("Wrong Format");
};

ParkingSystem.prototype.setParkingLotSize = function (slotSizes = []) {
  const slotSizesValid = slotSizes.every((slot) => this.sizes.includes(slot));
  const validLength =
    slotSizes.length === this.parkingSlot.length && slotSizes.length > 0;

  // console.table({
  //     slotSizesValid,
  //     slotSizeLength: slotSizes.length,
  //     parkingSlotLength: this.parkingSlot.length,
  //     validLength,
  //     thisSlotSize: this.slotSizes.length
  // })

  if (validLength && slotSizesValid) {
    /**
     * by using this function will modify vacantSlot adding object of 'sizeCategory
     * assuming occupiedSlot is empty array
     * [1, 2, 3, 1]
     */
    slotSizes.forEach((sizes, slotIndex) => {
      this.vacantSlot[slotIndex]["sizeCategory"] = sizes;
    });
    return (this.slotSizes = slotSizes);
  }
  console.error("Wrong Size for the given slots");
};

ParkingSystem.prototype.setSlotSizes = function (sizes = []) {
  sizes = sizes.sort();
  if (sizes.length > 0 && sizes.length < 3) 
    return (this.sizes = sizes);
  
  console.log("Invalid size length");
};

/**
 * 1. There are initially three (3) entry points, and can be no less than three (3), leading into the parking complex. A vehicle
  must be assigned a possible and available slot closest to the parking entrance. The mall can decide to add new entrances later.

 * @param {*} vehicleInfo 
 */
ParkingSystem.prototype.parkVehicle = function (vehicleInfo) {
  const vehicleHasSize = vehicleInfo && vehicleInfo.size !== undefined;
  const slotSizeValid =
    (this.slotSizes.length > 0 && this.slotSizes.length) || false;
  const parkingLotSizeValid =
    (this.parkingSlot.length > 0 && this.parkingSlot.length) || false;
  const validSlotsAndParkingSize =
    slotSizeValid &&
    parkingLotSizeValid &&
    slotSizeValid === parkingLotSizeValid;
  if (
    vehicleHasSize &&
    this.sizes.includes(vehicleInfo.size) &&
    validSlotsAndParkingSize
  ) {
    // console.table({
    //     vacant: this.vacantSlot.length,
    //     occupied: this.occupiedSlot.length,
    //     ...vehicleInfo,
    // })

    if (
      this.parkingSlot.length ===
      this.vacantSlot.length + this.occupiedSlot.length
    ) {
      const { size: vehicleSize, plate: vehiclePlate } = vehicleInfo;
      const entryPointClosestIndex = [];
      let sizeCategory;
      this.sizes.forEach((size, sizeIndex) => {
        let closestDistance = undefined;

        if (vehicleSize === size) sizeCategory = sizeIndex;
        this.vacantSlot.forEach((slot, vacantIndex) => {
          if (closestDistance === undefined)
            {closestDistance = {
              ...slot,
              vacantIndex,
              value: slot.info[sizeIndex],
            };}
          else
            {closestDistance =
              closestDistance.info[sizeIndex] > slot.info[sizeIndex]
                ? {
                    ...slot,
                    vacantIndex,
                    value: slot.info[sizeIndex],
                  }
                : {
                    ...closestDistance,
                    value: closestDistance.info[sizeIndex],
                  };}
        });
        entryPointClosestIndex.push(closestDistance);
      });

      /**
             * 2. There are three types of vehicles: small (S), medium (M) and large (L),
                and there are three types or parking slots: small (SP), medium (MP) and large (LP).

                (a) S vehicles can park in SP, MP and LP parking spaces;
                (b) M vehicles can park in MP and LP parking spaces; and
                (c) L vehicles can park only in LP parking spaces.

             */
      const small = 0,
        medium = 1,
        large = 2;
      let parkAt;
      switch (sizeCategory) {
        case 0:
          parkAt = entryPointClosestIndex.sort((a, b) => {
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            else return 0;
          })[0];
          break;

        case 1:
          parkAt =
            entryPointClosestIndex[medium] > entryPointClosestIndex[large]
              ? entryPointClosestIndex[large]
              : entryPointClosestIndex[medium];
          break;

        case 2:
          parkAt = entryPointClosestIndex[large];
          break;

        default:
          break;
      }
      // console.table({
      //     parkAt
      // })
      const entryPayload = {
        ...this.vacantSlot[parkAt.vacantIndex],
        vehicleInfo,
        time:
          (vehicleInfo && vehicleInfo.time && moment(vehicleInfo.time)) ||
          moment().format("YYYY-MM-DD HH:mm:ss"), //ignore past time as for testing purposes
      };
      const vacantInfo = this.vacantSlot[parkAt.vacantIndex];
      const hasDuplicateOccupied =
        this.occupiedSlot.some(
          (slot) => slot.vehicleInfo.plate === vehiclePlate
        ) && this.occupiedSlot.length > 0;

      if (hasDuplicateOccupied) {
        console.log("Has Duplicate entry", vehicleInfo);
        return;
      }

      if (
        vacantInfo &&
        vacantInfo.vehicleInfo &&
        vacantInfo.vehicleInfo.plate !== vehiclePlate
      )
        delete entryPayload.charge;

      if (entryPayload && entryPayload.charge) {
        const timeDiff = Math.abs(
          moment(entryPayload.time).diff(moment(), "hours")
        );
        /**
                 *  A vehicle
                 must be assigned a possible and available slot closest to the parking entrance.
                */
        if (timeDiff > 1) {
          debugger;
          entryPayload.charge = this.calculateCharge(timeDiff, this.slotSizes);
          entryPayload.time = moment().format("YYYY-MM-DD HH:mm:ss");
        }
      }
      this.occupiedSlot.push(entryPayload);
      this.vacantSlot.splice(parkAt.vacantIndex, 1);
    }
    return;
  }
  console.error("Provide a size key with correct value");
};

ParkingSystem.prototype.unparkVehicle = function (info) {
  /**
     * (c) A vehicle leaving the parking complex and returning within one hour must be charged continuous rate,
      i.e. the vehicle must be considered as if it did not leave. Otherwise, rates must be implemented as described.
     */
  const { vehicleInfo } = info;
  const occupiedIndex = this.occupiedSlot.findIndex(
    (x) => x.vehicleInfo.plate === vehicleInfo.plate
  );
  const charge = this.calculateCharge(4, info.sizeCategory);
  const unparkPayload = {
    ...this.occupiedSlot[occupiedIndex],
    charge,
  };
  if (occupiedIndex !== -1) {
    this.vacantSlot.push(unparkPayload);
    this.occupiedSlot.splice(occupiedIndex, 1);
    this.billChargeLogs.push(`Charge: ${charge}`);
  }
};

/**inputs */
const obj = new ParkingSystem();
// console.log(obj.addEntryPoint())
console.log(
  obj.mapParkingSlot([
    [0, 2, 3],
    [2, 0, 2],
    [3, 3, 0],
    [3, 1, 1],
  ])
);

console.log(obj.setParkingLotSize([1, 2, 3, 1]));

console.log(
  obj.parkVehicle({
    size: 2,
    plate: "xyz12",
  })
);

console.log(obj.unparkVehicle(obj.occupiedSlot[0]));

obj.parkVehicle({
  size: 2,
  plate: "xyz123",
});

obj.parkVehicle({
  size: 2,
  plate: "xyz123",
});

obj.parkVehicle({
  size: 2,
  plate: "ffasdfasdf",
});

obj.unparkVehicle(obj.occupiedSlot[obj.occupiedSlot.length - 1]);

obj.parkVehicle({
  size: 2,
  plate: "ffasdfasdf",
  time: moment("2022-04-04 15:07:45").format("YYYY-MM-DD HH:mm:ss"),
});

console.log(obj.vacantSlot, obj.occupiedSlot);
