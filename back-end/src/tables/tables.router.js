/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const seatRouter = require("../seat/seat.router");

router.use("/:table_id/seat", seatRouter);

router.route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;