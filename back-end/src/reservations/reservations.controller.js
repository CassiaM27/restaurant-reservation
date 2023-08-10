const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function bodyHas(req, res, next) {
  const { data } = req.body;
  if(data) {
    if(!data.first_name || data.first_name === "") {
      return next({ status: 400, message: `Request must include first_name` });
    } else if(!data.last_name || data.last_name === ""){
      return next({ status: 400, message: `Request must include last_name` });
    } else if(!data.mobile_number || data.mobile_number === "") {
      return next({ status: 400, message: `Request must include mobile_number` });
    } else if(!data.reservation_date || data.reservation_date === "" || data.reservation_date === undefined) {
      //if(data.reservation_date !== --validation here-- ) {
      //  return next({status: 400, message: `Request must include reservation_date`})
      //} else {
      //  return next();
      //}
      return next({ status: 400, message: `Request must include reservation_date` });
    } else if(!data.reservation_time || data.reservation_time === "") {
      //must also add verification that reservation_time is a valid time
      return next({ status: 400, message: `Request must include reservation_time` });
    } else if(!data.people || data.people === "" || !Number.isInteger(data.people)) {
      return next({ status: 400, message: `Request must include people, and people must be an integer` });
    }

    return next();
  }
  return next({ status: 400, message: `Request must include data` });
}

async function create(req, res) {
  const newReservation = req.body.data;
  const data = await service.create(newReservation)
  res.status(201).json({ data: data });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  /*
  if (date && Date.parse(date)) {
    const data = await service.listByDate(date);
    return res.json({ data });
  }
  */
  const data = await service.list();
  res.status(201).json({ data });

}

module.exports = {
  create: [bodyHas, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
