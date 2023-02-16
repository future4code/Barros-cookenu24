import express from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserController } from "../controller/UserController"
import { UserDatabase } from "../data/UserDatabase"


export const userRouter = express.Router()
const userDatabase = new UserDatabase()
const userBusiness = new UserBusiness(userDatabase)
const userController = new UserController(userBusiness)

userRouter.post("/signup", userController.signup)
userRouter.post("/login", userController.login)
userRouter.post("/follow", userController.followUser)

userRouter.delete("/unfollow", userController.unfollowUser)
userRouter.delete("/:userId", userController.deleteAccount)

userRouter.get("/:userId", userController.getUserById)
userRouter.get("/account", userController.getUserInfo)

userRouter.put("/recoverPassword", userController.recoverPassword)
