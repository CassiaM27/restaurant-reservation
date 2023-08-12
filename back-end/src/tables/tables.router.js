/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//const reservationsRouter = require("../reservations/reservations.controller")
//const reservations = router.use("/:reservationId", reservationsRouter)

//router.route(reservations)
  //.get(controller.read)
  //.methodNotAllowed();

router.route("/:tableId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

router.route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;