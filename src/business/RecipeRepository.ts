import { Recipe } from "../model/Recipe"


export interface RecipeRepository {
    createRecipe (newRecipe: Recipe): Promise<void>
    getRecipes (userId: string): Promise<Recipe[]>
}