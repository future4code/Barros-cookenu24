import express from "express"
import { RecipeBusiness } from "../business/RecipeBusiness"
import { RecipeController } from "../controller/RecipeController"
import { RecipeDatabase } from "../data/RecipeDatabase"


export const recipeRouter = express.Router()
const recipeDatabase = new RecipeDatabase()
const recipeBusiness = new RecipeBusiness(recipeDatabase)
const recipeController = new RecipeController(recipeBusiness)