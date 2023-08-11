const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function bodyHas(req, res, next) {
  const { data } = req.body;
  const date = new Date(data.reservation_date);
  const time = parseInt(data.reservation_time);

  if(data === {}) {
    return next({ status: 400, message: `Request must include data` });
  } else {
    if(!data.first_name || data.first_name === "") {
      //verify if first_name exists and is not empty string
      return next({ status: 400, message: `Request must include first_name` });
    } else if(!data.last_name || data.last_name === ""){
      //verify if last_name exists and is not empty string
      return next({ status: 400, message: `Request must include last_name` });
    } else if(!data.mobile_number || data.mobile_number === "") {
      //verify if mobile_number exists and is not empty string
      return next({ status: 400, message: `Request must include mobile_number` });
    } else if(!data.reservation_date || !Number.isInteger(Date.parse(date))) {
      //verify if reservation_date exists and is a valid date
      return next({ status: 400, message: `Request must include reservation_date` });
    } else if(date.getDay() === 1) {
      //verify is reservation_date is NOT a Tuesday, as restaurant is closed on Tuesdays
      return next({ status: 400, message: `Restaurant is closed on Tuesdays, please choose another day` });
    } else if(new Date() > date) {
      //verify that reservation_date is not in the past
      return next({ status: 400, message: `Reservation date must be in the future` });
    } else if(!data.reservation_time || !Number.isInteger(time)) {
      //verify that reservation_time is a valid time
      return next({ status: 400, message: `Request must include reservation_time` });
    } else if(data.reservation_time <= "10:30" || data.reservation_time > "21:30") {
      //verify that reservation_time is within restaurant hours and allows enough time for customer to finish meal
      return next({ status: 400, message: `Reservation must be between 10:30AM and 9:30PM` });
    } else if(!data.people || data.people === "" || !Number.isInteger(data.people)) {
      //verify that reservation includes number of people as integer
      return next({ status: 400, message: `Request must include people, and people must be an integer` });
    }
    return next();
  }
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  if(reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({ status: 404, message: `id not found: ${req.params.reservationId}`})
  }
}

async function create(req, res) {
  const newReservation = req.body.data;
  //console.log(newReservation.date.getDay())
  const data = await service.create(newReservation)
  res.status(201).json({ data: data });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  if (date) {
    const data = await service.listByDate(date);
    return res.json({ data });
  }
  const data = await service.list();
  res.status(201).json({ data });

}

async function read(req, res) {
  res.status(201).json({ data: await service.read(req.params.reservation_id) });
}

async function update(req, res) {
  const data = req.body.data;
  const updatedReservation = await service.update(data)
  res.status(201).json({ data: updatedReservation })
}

module.exports = {
  create: [bodyHas, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [bodyHas, asyncErrorBoundary(update)],
};
