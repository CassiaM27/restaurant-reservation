const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

const TABLE_FIELDS = ["table_name", "capacity"];

/**
 * Verifies table data before creation of new table
 */
function validTableCheck(req, res, next) {
  const table = req.body.data;
  if (!table) {
    return next({ status: 400, message: "Must have data" });
  }

  TABLE_FIELDS.forEach((field) => {
    if (!table[field]) {
      return next({ status: 400, message: `Must have ${field} property.` });
    }
  });

  if (typeof table.capacity !== "number") {
    return next({ status: 400, message: "capacity must be a number greater than 0" });
  }

  if (table.table_name.length < 2) {
    return next({ status: 400, message: "table_name must be at least two characters long." });
  }
  next();
}

/**
 * Lists all tables saved in the database
 */
async function list(req, res, next) {
  const data = await service.list();
  res.json({ data });
}

/**
 * Saves a new table to the database
 */
async function create(req, res, next) {
  const table = req.body.data;
  const newTable = await service.create(table);
  table.reservation_id = newTable.reservation_id;
  table.table_id = newTable.table_id;
  res.status(201).json({ data: table });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    validTableCheck,
    asyncErrorBoundary(create)
  ],
  validTableCheck,
};