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
  const table = await service.read(req.params.tableId);
  if(table) {
    res.locals.table = table;
    return next();
  } else {
    return next({ status: 404, message: `id not found: ${req.params.tableId}`})
  }
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
  res.status(200).json({ data: await service.read(req.params.tableId) });
}

async function update(req, res) {
  const data = req.body.data;
  const updatedTable = await service.update(data)
  res.status(201).json({ data: updatedTable })
}

module.exports = {
  create: [bodyHas, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  update: [bodyHas, asyncErrorBoundary(update)],
};