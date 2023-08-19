const router = require("express").Router({ mergeParams: true });
const controller = require("./seat.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/")
  .put(controller.update)
  .delete(controller.finish)
  .all(methodNotAllowed);

module.exports = router;