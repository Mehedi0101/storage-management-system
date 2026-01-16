const express = require('express');

const authMiddleware = require("../middlewares/authMiddlewares");
const { updateUser, changePassword, deleteUser, getCurrentUser } = require("../controllers/userController");

const userRouter = express.Router();

// all user routes secured
userRouter.use(authMiddleware);

// get current user info
userRouter.get("/me", getCurrentUser);

// update user info route
userRouter.patch("/update", updateUser);

// update user password route
userRouter.patch("/change-password", changePassword);

// delete existing user route
userRouter.delete("/delete", deleteUser);

module.exports = userRouter;