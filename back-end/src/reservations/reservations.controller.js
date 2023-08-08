const service = require("./reservations.service");
const nextId = require("../utils/nextId")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function bodyHas(req, res, next) {
  console.debug(req.body);
  const { data } = req.body;
  if(data) {
    
    if(!data.first_name || data.first_name === "") {
      return next({ status: 400, message: `Request must include first_name` });
    } else if(!data.last_name || data.last_name === ""){
      return next({ status: 400, message: `Request must include last_name` });
    } else if(!data.mobile_number || data.mobile_number === "") {
      return next({ status: 400, message: `Request must include mobile_number` });
    } else if(!data.reservation_date || data.reservation_date == "") {
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
  newReservation.id = nextId();
  res.status(201).json({ data: newReservation });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { reservation_date } = req.query;
  if (reservation_date) {
    const data = await service.listByDate();
    return res.json({ data });
  }
  const data = await service.list();
  res.json({ data });

}

module.exports = {
  create: [bodyHas, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
