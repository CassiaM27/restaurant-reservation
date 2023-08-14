const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function bodyHas(req, res, next) {
  const { data } = req.body;

  if(!data) {
    return next({ status: 400, message: `Request must include data` });
  } else {
    if(!data.table_name || !data.table_name === "" || data.table_name.length === 1) {
      return next({ status: 400, message: `Request must include table_name that is at least 2 characters` });
    } else if(!data.capacity || !Number.isInteger(data.capacity)) {
      return next({ status: 400, message: `Request must include capacity as a number` });
    }
  }
  return next();
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if(table) {
    res.locals.table = table;
    return next();
  } else {
    return next({ status: 404, message: `id not found: ${req.params.table_id}`})
  }
}

async function seatVerification(req, res, next) {
  const { data } = req.body;
  //const reservation = await service.read(req.params.reservation_id);
  //const table = await service.read(req.params.table_id);

  console.log(data)

  if(!data) {
    return next({ status: 400, message: `Request must include data` });
  } else {
    if(!data.reservation_id || data.reservation_id === "") {
      return next({ status: 400, message: `Request must include reservation_id` });
    } else if(data.people > table.capacity) {
      return next({ status: 400, message: `Table does not have enough capacity` });
    } else if(table.occupied === true) {
      return next({ status: 400, message: `Table is already occupied` });
    }
  }
  return next();
}

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

async function read(req, res) {
  res.status(200).json({ data: await service.read(req.params.table_id) });
}

async function update(req, res) {
  const data = req.body.data;
  const updatedTable = await service.update(data)
  res.status(200).json({ data: updatedTable })
}

module.exports = {
  create: [bodyHas, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  update: [bodyHas, asyncErrorBoundary(update)],
  seat: [asyncErrorBoundary(seatVerification), asyncErrorBoundary(update)],
};