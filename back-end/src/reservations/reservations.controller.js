const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * Validation for all reservation properties
 */

/**
 * Defines required reservation properties
 */
const RESERVATION_FIELDS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

/**
 * Validates reservation time
 */
function _validateTime(str) {
  const [hour, minute] = str.split(":");

  if (hour.length > 2 || minute.length > 2) {
    return false;
  }
  if (hour < 1 || hour > 23) {
    return false;
  }
  if (minute < 0 || minute > 59) {
    return false;
  }
  return true;
}

/**
 * Validates all core reservation properties
 */
function reservationValid(req, res, next) {
  const reservation = req.body.data;

  if (!reservation) {
    return next({ status: 400, message: `Must have data property.` });
  }

  RESERVATION_FIELDS.forEach((field) => {
    if (!reservation[field]) {
      return next({ status: 400, message: `${field} field required` });
    }

    if (field === "people" && typeof reservation[field] !== "number") {
      return next({
        status: 400,
        message: `${reservation[field]} is not a number type for people field.`,
      });
    }

    if (field === "reservation_date" && !Date.parse(reservation[field])) {
      return next({ status: 400, message: `${field} is not a valid date.` });
    }

    if (field === "reservation_time") {
      if (!_validateTime(reservation[field])) {
        return next({ status: 400, message: `${field} is not a valid time` });
      }
    }
  });

  next();
}

/**
 * Verifies that reservation is not for a Tuesday
 */
function notTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const [year, month, day] = reservation_date.split("-");
  const date = new Date(`${month} ${day}, ${year}`);
  res.locals.date = date;
  if (date.getDay() === 2) {
    return next({ status: 400, message: "Location is closed on Tuesdays" });
  }
  next();
}

/**
 * Verifies that the reservation is not in the past
 */
function futureDate(req, res, next) {
  const date = res.locals.date;
  const today = new Date();
  if (date < today) {
    return next({ status: 400, message: "Must be a future date" });
  }
  next();
}

/**
 * Verifies that reservation is scheduled within business hours
 */
function restaurantOpen(req, res, next) {
  const reservation = req.body.data;
  const [hour, minute] = reservation.reservation_time.split(":");
  if (hour < 10 || hour > 21) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  if ((hour < 11 && minute < 30) || (hour > 20 && minute > 30)) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  next();
}

/**
 * Verifies reservation status is "booked" for all new reservations
 */
function statusBooked(req, res, next) {
  const { status } = res.locals.reservation
    ? res.locals.reservation
    : req.body.data;
  if (status === "seated" || status === "finished" || status === "cancelled") {
    return next({
      status: 400,
      message: `New reservation can not have ${status} status.`,
    });
  }
  next();
}

/**
 * Verifies that status is an allowed value
 */
function statusValid(req, res, next) {
  const VALID_STATUSES = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (!VALID_STATUSES.includes(status)) {
    return next({ status: 400, message: "Status unknown." });
  }
  next();
}

/**
 * Verifies if status is "finished" to prevent edits on completed reservations
 */
function statusFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "Cannot change a reservation with a finished status.",
    });
  }
  next();
}

/**
 * Verifies if reservation exists
 */
const reservationExists = async (req, res, next) => {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation_id ${reservation_id} does not exist.`,
  });
};

/**
 * Lists all reservations saved in the database with functionality for both search and sorting by date
 */
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if (mobile_number) {
    reservations = await service.search(mobile_number);
  } else {
    reservations = date ? await service.listByDate(date) : await service.list();
  }
  res.json({
    data: reservations,
  });
}

/**
 * Saves a new reservation to the database
 */
async function create(req, res) {
  const reservation = req.body.data;
  const { reservation_id } = await service.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({ data: reservation });
}

/**
 * Retrieves a single reservation from the database
 */
async function read(req, res) {
  const reservation = await service.read(res.locals.reservation.reservation_id);
  res.json({ data: reservation });
}

/**
 * Updates the status of a given reservation
 */
async function update(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;
  const reservation = await service.update(reservation_id, status);
  res.json({ data: reservation });
}

/**
 * Updates/Edits a reservation
 */
async function modify(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = req.body.data;
  const data = await service.modify(reservation_id, reservation);
  reservation.reservation_id = data.reservation_id;
  res.json({ data: reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(reservationValid),
    notTuesday,
    futureDate,
    restaurantOpen,
    statusBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    statusValid,
    statusFinished,
    asyncErrorBoundary(update),
  ],
  modify: [
    reservationValid,
    notTuesday,
    futureDate,
    restaurantOpen,
    asyncErrorBoundary(reservationExists),
    statusBooked,
    asyncErrorBoundary(modify),
  ],
};