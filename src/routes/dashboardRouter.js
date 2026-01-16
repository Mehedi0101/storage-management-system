const express = require("express");
const authMiddleware = require("../middlewares/authMiddlewares");
const { getDashboardStats } = require("../controllers/dashboardController");

const dashboardRouter = express.Router();

// get dashboard overview route
dashboardRouter.get("/overview", authMiddleware, getDashboardStats);

module.exports = dashboardRouter;
