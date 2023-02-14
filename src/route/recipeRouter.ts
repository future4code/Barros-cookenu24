import express from "express"
import { RecipeBusiness } from "../business/RecipeBusiness"
import { RecipeController } from "../controller/RecipeController"
import { RecipeDatabase } from "../data/RecipeDatabase"
import { UserDatabase } from "../data/UserDatabase"


export const recipeRouter = express.Router()
const recipeDatabase = new RecipeDatabase()
const userDatabase = new UserDatabase()
const recipeBusiness = new RecipeBusiness(recipeDatabase, userDatabase)
const recipeController = new RecipeController(recipeBusiness)

recipeRouter.post("/create", recipeController.createRecipe)
recipeRouter.get("/", recipeController.getRecipes)
recipeRouter.get("/:id", recipeController.getRecipeById)