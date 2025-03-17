// IMPORTING REQUIREMENTS
const Router = require("express");
const { getAllUser, getUserById, signupUser, loginUser, refreshToken, logoutUser, forgotPassword, resetPassword } = require("../Controllers/user.controller");
const isToken = require("../Middlewares/authToken.middleware");
const extractUserId = require("../Middlewares/extractUserId.middleware");
const userRouter = Router();

// USER ROUTES
userRouter.get("/get-alluser" , getAllUser);
userRouter.get("/get-userbyid" , extractUserId , isToken , getUserById);
userRouter.post("/signup-user" , signupUser);
userRouter.post("/login-user" , loginUser);
userRouter.post("/refresh-token" , refreshToken);
userRouter.post("/forgot-password" , forgotPassword);
userRouter.post("/reset-password" ,resetPassword)
userRouter.post("/logout-user" ,logoutUser )

// EXPORTING USER ROUTER
module.exports = userRouter;