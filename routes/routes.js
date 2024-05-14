const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const {verifyTokenAdmin} = require("../commanFunctions/verifyToken");

router.post("/login", userController.login);
router.post("/home",verifyTokenAdmin,userController.home)
router.post("/addBook",verifyTokenAdmin,userController.addBook)
router.post("/deleteBook",verifyTokenAdmin,userController.deleteBook)

module.exports = router;