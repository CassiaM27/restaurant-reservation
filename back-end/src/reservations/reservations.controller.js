const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/**
 * Validation for all reservation properties
 */

/**
 * Verifies if reservation exists before proceeding
 */
async function reservationExists(req, res, next) {
  const reservation_id = req.params.reservation_id || (req.body.data || {}).reservation_id;
  const reservation = await service.read(reservation_id);
  if(reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({ status: 404, message: `id not found: ${reservation_id}` })
  }
}

/**
 * Define required reservation properties
 */
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

/**
 * Define all valid reservation properties
 */
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function hasValidDate(req, res, next) {
  const { data = {} } = req.body;
  const date = data.reservation_date;
  const time = data.reservation_time;
  const formattedDate = new Date(`${date}T${time}`);
  const day = new Date(date).getUTCDay();

  if (isNaN(Date.parse(data.reservation_date))) {
    return next({ status: 400, message: `Invalid reservation_date`, });
  }
  if (day === 2) {
    return next({ status: 400, message: `Restaurant is closed on Tuesdays` });
  }
  if (formattedDate <= new Date()) {
    return next({ status: 400, message: `Reservation must be in the future` });
  }
  next();
}

function hasValidTime(req, res, next) {
  const { data = {} } = req.body;
  const time = data.reservation_time;

  if (!/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(time)) {
    next({ status: 400, message: `Invalid reservation_time` });
  }

  if (time < "10:30" ) {
    next({ status: 400, message: `Reservation must be after 10:30AM` });
  }
  if (time > "21:30") {
    next({ status: 400, message: `Reservation must be before 9:30PM`, });
  }
  next();
}

function hasValidNumberOfPeople(req, res, next) {
  const { data = {} } = req.body;

  if (data.people === 0 || !Number.isInteger(data.people)) {
    return next({ status: 400, message: `Invalid number of people` });
  }
  next();
}

function hasValidStatus(req, res, next) {
  const { status } = req.body.data;
  const currentStatus = res.locals.reservation.status;

  if (currentStatus === "finished" || currentStatus === "cancelled") {
    return next({ status: 400, message: `Reservation status is finished` });
  }
  if (
    status === "booked" ||
    status === "seated" ||
    status === "finished" ||
    status === "cancelled"
  ) {
    res.locals.status = status;
    return next();
  }
  next({ status: 400, message: `Invalid status: ${status}` });
}

function isBooked(req, res, next) {
  const { status } = req.body.data;

  if (status && status !== "booked") {
    return next({ status: 400, message: `Invalid status: ${status}` });
  }
  next();
}
/**
 * End of reservation properties validation
 */



/**
 * Handler to add reservation to the database
 */
async function create(req, res) {
  const newReservation = req.body.data;
  const data = await service.create(newReservation)
  res.status(201).json({ data: data });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  const data = await (date
    ? service.list(date)
    : service.search(mobile_number));
  res.status(200).json({ data: data });

}

/**
 * Read handler for reservation resources
 */
async function read(req, res) {
  res.status(200).json({ data: await service.read(req.params.reservation_id) });
}

/**
 * Update handler for reservation resources
 */
async function update(req, res) {
  const data = {
    ...req.body.data,
    reservation_id: res.locals.reservation_id,
  };
  const updatedReservation = await service.update(data)
  res.status(200).json({ updatedReservation })
}

/**
 * Status update (booked, seated, finished, cancelled) handler for reservation resources
 */
async function updateStatus(req, res) {
  const { status } = res.locals;
  const { reservation_id } = res.locals.reservation;
  const data = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data });
}

module.exports = {
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidDate,
    hasValidTime,
    hasValidNumberOfPeople,
    isBooked,
    asyncErrorBoundary(create)
  ],
  list: asyncErrorBoundary(list),
  read: [
    reservationExists,
    asyncErrorBoundary(read)
  ],
  update: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidDate,
    hasValidTime,
    hasValidNumberOfPeople,
    hasValidStatus,
    reservationExists,
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    hasValidStatus,
    reservationExists,
    asyncErrorBoundary(updateStatus)
  ],
  reservationExists,
};
