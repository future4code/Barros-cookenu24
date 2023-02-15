import { RecipeRepository } from "../business/RecipeRepository";
import { CustomError } from "../error/CustomError";
import { Recipe, updateRecipeDTO } from "../model/Recipe";
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
            return await BaseDatabase.connection(this.TABLE_NAME).select().where("fk_user_id", userId).orderBy("created_at", "desc")
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getRecipeById = async (id: string): Promise<any> => {
        try {
            const result = await BaseDatabase.connection(this.TABLE_NAME).select().where("id", id)
            return result[0]
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    editRecipe = async (updateRecipe: updateRecipeDTO): Promise<void> => {
        try {
            await BaseDatabase.connection(this.TABLE_NAME)
            .update({title: updateRecipe.title, description: updateRecipe.description})
            .where("id", updateRecipe.id)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}