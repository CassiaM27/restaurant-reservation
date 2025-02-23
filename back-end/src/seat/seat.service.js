const knex = require("../db/connection");

function update(table_id, reservation_id) {
  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .select("*")
      .where({ reservation_id })
      .update({ status: "seated" })
      .transacting(transaction);

    return knex("tables")
      .select("*")
      .where({ table_id: table_id })
      .update({ reservation_id })
      .update({ status: "occupied"})
      .transacting(transaction)
      .then((updated) => updated[0]);
  });
}

function finish(table_id, reservation_id) {
  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .select("*")
      .where({ reservation_id })
      .update({ status: "finished" })
      .transacting(transaction);

    return knex("tables")
      .select("*")
      .where({ table_id: table_id })
      .update({ reservation_id })
      .update({ status: "unoccupied"})
      .transacting(transaction)
      .then((updated) => updated[0]);
  });
}

module.exports = {
  update,
  finish
};