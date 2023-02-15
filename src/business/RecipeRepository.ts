import { Recipe, updateRecipeDTO } from "../model/Recipe"


export interface RecipeRepository {
    createRecipe (newRecipe: Recipe): Promise<void>
    getRecipes (userId: string): Promise<Recipe[]>
    getRecipeById (id: string): Promise<any>
    editRecipe (updateRecipe: updateRecipeDTO): Promise<void>
}