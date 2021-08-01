const express = require("express");
const router = express.Router();
const controllers = require("./controllers");

//auth
router.post("/auth/signup", controllers.signup);

router.post("/auth/signin", controllers.signin);

// users

router.get("/users", controllers.users);

//board, venues, votes

router.put("/board", controllers.updateBoard);
router.get("/board", controllers.getBoard);

module.exports = router;
