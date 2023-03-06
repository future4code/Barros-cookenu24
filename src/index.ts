import { app } from "./app"
import { recipeRouter } from "./route/recipeRouter"
import { userRouter } from "./route/userRouter"


app.use("/users", userRouter)
app.use("/recipes", recipeRouter)