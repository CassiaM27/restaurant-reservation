const service = require("./seat.service");
const reservationService = require("../reservations/reservations.service");
const tableService = require("../tables/tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Verifies if table has sufficient capacity to seat the reservation
 */
async function tableCheck(req, res, next) {
  const { table_id } = req.params;
  const currentTable = await tableService.read(table_id);
  const reservation = res.locals.reservation;
  if (reservation.people > currentTable.capacity) {
    return next({
      status: 400,
      message: "Table does not have sufficient capacity.",
    });
  }

  if (currentTable.reservation_id) {
    return next({ status: 400, message: "Table occupied." });
  }

  next();
}

/**
 * Verifies if table exists and if it is occupied
 */
async function occupiedCheck(req, res, next) {
  const { table_id } = req.params;
  const table = await tableService.read(table_id);
  if (!table) {
    return next({ status: 404, message: `Table ${table_id} not found` });
  }
  if (!table.reservation_id) {
    return next({ status: 400, message: "Table is not occupied" });
  }
  res.locals.reservation_id = table.reservation_id;
  next();
}

/**
 * Verifies if reservation exists in database before proceeding
 */
async function reservationExistsCheck(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  if (!reservation) {
    return next({ status: 404, message: `${reservation_id} does not exist` });
  }
  res.locals.reservation = reservation;
  next();
}

/**
 * Verifies if reservation_id exists in data
 */
function idCheck(req, res, next) {
  const table = req.body.data;
  if (!table) {
    return next({ status: 400, message: "Must have data" });
  }
  if (!table.reservation_id) {
    return next({ status: 400, message: "Must have reservation_id" });
  }
  next();
}

/**
 * Verifies if reservation has already been seated
 */
function seatedCheck(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "seated") {
    return next({ status: 400, message: "Reservation is already seated" });
  }
  next();
}

/**
 * Updates reservation and table statuses
 */
async function update(req, res, next) {
  const { reservation_id } = req.body.data;
  const { table_id } = req.params;
  await service.update(table_id, reservation_id);
  res.status(200).json({ data: reservation_id });
}

/**
 * Clears table and updates reservation status
 */
async function unassign(req, res, next) {
  const { table_id } = req.params;
  const reservation = await reservationService.finish(
    res.locals.reservation_id
  );
  const table = await service.update(table_id, null);
  res.json({ data: table });
}

module.exports = {
  update: [
    idCheck,
    asyncErrorBoundary(reservationExistsCheck),
    seatedCheck,
    asyncErrorBoundary(tableCheck),
    asyncErrorBoundary(update),
  ],
  unassign: [asyncErrorBoundary(occupiedCheck), asyncErrorBoundary(unassign)],
};