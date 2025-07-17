const express = require("express");
const router = express.Router();
const taskCtrl = require("../controllers/taskCtrl");
const { tokenAuth } = require('../middlewares/auth');



router.post("/create", tokenAuth, taskCtrl.createTask);
router.get("/getAll",  tokenAuth, taskCtrl.getTasks);
router.get("/:id", tokenAuth,  taskCtrl.getTaskById);
router.put("/update/:id", tokenAuth, taskCtrl.updateTask);
router.delete("/delete/:id", tokenAuth, taskCtrl.deleteTask);

module.exports = router;
