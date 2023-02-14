import { CustomError } from "../error/CustomError"
import { MissingDescription, MissingTitle } from "../error/recipeErrors"
import { MissingToken, Unauthorized } from "../error/userErrors"
import { inputCreateRecipeDTO, Recipe } from "../model/Recipe"
import { Authenticator } from "../services/Authenticator"
import { RecipeRepository } from "./RecipeRepository"


export class RecipeBusiness {
    constructor (private recipeDatabase: RecipeRepository) {}

    createRecipe = async (input: inputCreateRecipeDTO): Promise<void> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            if (!input.title) {
                throw new MissingTitle()
            }

            if (!input.description) {
                throw new MissingDescription()
            }

            const authenticator = new Authenticator()
            const tokenIsValid = await authenticator.getTokenData(input.token)

            if (!tokenIsValid) {
                throw new Unauthorized()
            }

            const createdAt = new Date(new Date().toISOString().split("/").reverse().join(","))
            const newRecipe = new Recipe(input.title, input.description, createdAt, tokenIsValid.id)
            
            await this.recipeDatabase.createRecipe(newRecipe)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}