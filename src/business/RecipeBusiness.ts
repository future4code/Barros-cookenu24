import { CustomError } from "../error/CustomError"
import { MissingDescription, MissingRecipeId, MissingTitle, NoRecipeFound } from "../error/recipeErrors"
import { MissingToken, Unauthorized } from "../error/userErrors"
import { inputCreateRecipeDTO, inputGetRecipeDTO, Recipe } from "../model/Recipe"
import { Authenticator } from "../services/Authenticator"
import { RecipeRepository } from "./RecipeRepository"
import { UserRepository } from "./UserRepository"


export class RecipeBusiness {
    constructor (private recipeDatabase: RecipeRepository, private userDatabase: UserRepository) {}

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


    getRecipes = async (token: string): Promise<Recipe[]> => {
        try {
            if (!token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const tokenIsValid = await authenticator.getTokenData(token)

            if (!tokenIsValid) {
                throw new Unauthorized()
            }
            
            const followingUsers = await this.userDatabase.getFollowingUsers(tokenIsValid.id)
    
            const result: Recipe[] = []
            for (let item of followingUsers) {
                const recipe = await this.recipeDatabase.getRecipes(item.fk_user_id)
                result.push(...recipe)
            }

            return result

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getRecipeById = async (input: inputGetRecipeDTO): Promise<Recipe> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }
            if (!input.id) {
                throw new MissingRecipeId()
            }

            const authenticator = new Authenticator()
            const tokenIsValid = await authenticator.getTokenData(input.token)

            if (!tokenIsValid) {
                throw new Unauthorized()
            }
            
            const result = await this.recipeDatabase.getRecipeById(input.id)
            if (!result) {
                throw new NoRecipeFound()
            }

            return result

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}