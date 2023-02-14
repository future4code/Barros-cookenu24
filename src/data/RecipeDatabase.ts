import { RecipeRepository } from "../business/RecipeRepository";
import { CustomError } from "../error/CustomError";
import { Recipe } from "../model/Recipe";
import { BaseDatabase } from "./BaseDatabase"


export class RecipeDatabase extends BaseDatabase implements RecipeRepository {
    TABLE_NAME = "cookenu_recipes"

    createRecipe = async (newRecipe: Recipe): Promise<void> => {
        try {
            await BaseDatabase.connection(this.TABLE_NAME).insert(newRecipe)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getRecipes = async (userId: string): Promise<Recipe[]> => {
        try {
            return await BaseDatabase.connection(this.TABLE_NAME).select().where("fk_user_id", userId)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}