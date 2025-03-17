// IMPORTING REQUIREMENTS
const Router = require("express");
const { getAllUser, getUserById, signupUser, loginUser, refreshToken, logoutUser, forgotPassword, resetPassword, updateUser, deleteUser, softDeleteUser, hardDeleteUser, restoreUser } = require("../Controllers/user.controller");
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
userRouter.post("/logout-user" ,extractUserId,logoutUser );
userRouter.put("/update-user" , extractUserId , updateUser);
userRouter.put("/delete-user" , extractUserId,softDeleteUser);
userRouter.delete("/hard-delete-user" , extractUserId , hardDeleteUser);
userRouter.put("/restore-user" , extractUserId , restoreUser);

// EXPORTING USER ROUTER
module.exports = userRouter;