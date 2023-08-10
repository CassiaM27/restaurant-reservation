const knex = require("../db/connection");

async function list() {
  return knex("reservations").select("*")
}

async function listByDate(date) {
  return knex("reservations as r")
    .select("*")
    .where({"r.reservation_date": date})
}
async function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((createdRecords) => createdRecords[0])
}

module.exports = {
  list,
  listByDate,
  create,
}