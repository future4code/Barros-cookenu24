import { CustomError } from "./CustomError"


export class MissingTitle extends CustomError {
    constructor () {
        super(422, "Provide the title of the recipe.")
    }
}

export class MissingDescription extends CustomError {
    constructor () {
        super(422, "Provide the description of the recipe.")
    }
}