import { Request, Response } from "express"
import { RecipeBusiness } from "../business/RecipeBusiness"
import { inputCreateRecipeDTO } from "../model/Recipe"


export class RecipeController {
    constructor (private recipeBusiness: RecipeBusiness) {}

    createRecipe = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputCreateRecipeDTO = {
                title: req.body.title,
                description: req.body.description,
                token: req.headers.authorization as string
            }

            await this.recipeBusiness.createRecipe(input)
            res.status(201).send("Success! The recipe has been registered.")
            
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }
}