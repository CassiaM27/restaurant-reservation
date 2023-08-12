const knex = require("../db/connection");

async function list() {
  return knex("tables")
    .select("*")
    .orderBy("tables.table_name");
}

async function create(newTable) {
  return knex("tables")
    .insert(newTable, "*")
    .then((createdRecords) => createdRecords[0]);
}

async function read(id) {
  return knex("tables as t")
    .select("*")
    .where({ "t.table_id": id })
    .first();
}

async function update(updatedTable) {
  return knex("tables as t")
    .insert(updatedTable, "*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  list,
  create,
  read,
  update,
}