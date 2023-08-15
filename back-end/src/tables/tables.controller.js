const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationsController = require("../reservations/reservations.controller");

const hasRequiredProperties = hasProperties("table_name", "capacity");
const hasReservationId = hasProperties("reservation_id");

/**
 * Verifies if reservation exists before proceeding
 */
async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if(table) {
    res.locals.table = table;
    return next();
  } else {
    return next({ status: 404, message: `id not found: ${req.params.table_id}`})
  }
}

/**
 * Validation for all table properties
 */
function hasValidName(req, res, next) {
  const table_name = req.body.data.table_name;

  if (table_name.length < 2) {
    return next({ status: 400, message: `Invalid table_name` });
  }
  next();
}

function hasValidCapacity(req, res, next) {
  const capacity = req.body.data.capacity;

  if (capacity < 1 || !Number.isInteger(capacity)) {
    return next({ status: 400, message: `Invalid capacity` });
  }
  next();
}

function hasSufficientCapacity(req, res, next) {
  const capacity = res.locals.table.capacity;
  const people = res.locals.reservation.people;

  if (capacity < people) {
    return next({ status: 400, message: `Table does not have sufficient capacity` });
  }
  next();
}

function tableIsOccupied(req, res, next) {
  if (res.locals.table.occupied) {
    return next({ status: 400, message: `Table is occupied` });
  }
  next();
}

function tableIsNotSeated(req, res, next) {
  if (res.locals.reservation.status === "seated") {
    return next({ status: 400, message: `Table is already seated` });
  }
  next();
}

function tableIsNotOccupied(req, res, next) {
  if (!res.locals.table.occupied) {
    return next({ status: 400, message: `Table is not occupied` });
  }
  next();
}
/**
 * End of table properties validation
 */

/**
 * Handler for saving a new table
 */
async function create(req, res) {
  const newTable= req.body.data;
  const data = await service.create(newTable)
  res.status(201).json({ data: data });
}

/**
 * List handler for table resources
 */
async function list(req, res) {
  const data = await service.list();
  res.status(200).json({ data });

}

/**
 * Handler for updating an existing table
 */
async function update(req, res) {
  console.log("reservation_id", res.locals.reservation.reservation_id, "table", res.locals.table)
  const reservation_id = req.body.data;
  const table_id = res.locals.table.table_id;
  const updatedTable = await service.update(reservation_id, table_id);
  res.status(200).json({ updatedTable });
}

/**
 * Handler to "finish" a reservation and clear table for new guests
 */
async function finish(req, res) {
  const reservation_id = req.locals.table.reservation_id;
  const table_id = res.locals.table.table_id;
  const data = await service.finish(reservation_id, table_id);
  res.status(200).json({ data });
}

module.exports = {
  create: [
    hasRequiredProperties,
    hasValidName,
    hasValidCapacity,
    asyncErrorBoundary(create)
  ],
  list: asyncErrorBoundary(list),
  update: [
    asyncErrorBoundary(tableExists),
    hasReservationId,
    reservationsController.reservationExists,
    hasSufficientCapacity,
    tableIsNotSeated,
    tableIsOccupied,
    asyncErrorBoundary(update)
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    tableIsNotOccupied,
    asyncErrorBoundary(finish),
  ],
};