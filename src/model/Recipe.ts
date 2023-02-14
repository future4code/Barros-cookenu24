export class Recipe {
    constructor (private title: string, private description: string, private created_at: Date, private fk_user_id: string) {
        this.title = title
        this.description = description
        this.created_at = created_at
        this.fk_user_id = fk_user_id
    }
}

export interface inputCreateRecipeDTO {
    title: string,
    description: string,
    token: string
}

export interface inputGetRecipeDTO {
    id: string,
    token: string
}