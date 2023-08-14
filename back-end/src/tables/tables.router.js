/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const reservationsRouter = require("../reservations/reservations.router")
const seatReservation = router.use("/reservations/:reservation_id/tables/:table_id/seat", reservationsRouter)

router.route(seatReservation)
  .put(controller.seat)
  .all(methodNotAllowed);

router.route("/:table_id")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

router.route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;