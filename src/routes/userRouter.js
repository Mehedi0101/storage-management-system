const express = require('express');

const authMiddleware = require("../middlewares/authMiddlewares");
const { updateUser, changePassword, deleteUser } = require("../controllers/userController");

const userRouter = express.Router();

// update user info route
userRouter.patch("/update", authMiddleware, updateUser);

// update user password route
userRouter.patch("/change-password", authMiddleware, changePassword);

// delete existing user route
userRouter.delete("/delete", authMiddleware, deleteUser);

module.exports = userRouter;