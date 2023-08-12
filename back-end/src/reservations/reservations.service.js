const knex = require("../db/connection");

async function list() {
  return knex("reservations").select("*").orderBy("reservation_time");
}

async function listByDate(date) {
  return knex("reservations as r")
    .select("*")
    .where({"r.reservation_date": date})
    .orderBy("reservation_time")
}
async function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

async function read(id) {
  return knex("reservations as r")
    .select("*")
    .where({ "r.reservation_id": id })
    .first();
}

async function update(updatedReservation) {
  return knex("reservations as r")
    .insert(updatedReservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  list,
  listByDate,
  create,
  read,
  update,
}