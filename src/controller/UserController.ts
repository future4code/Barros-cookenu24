import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { inputLoginDTO, inputSignupDTO } from "../model/User"


export class UserController {
    constructor (private userBusiness: UserBusiness) {}

    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputSignupDTO = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            }

            const token = await this.userBusiness.signup(input)

            res.status(201).send({message: "Success! The user has been registered.", token})

        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputLoginDTO = {
                email: req.body.email,
                password: req.body.password
            }

            const token = await this.userBusiness.login(input)

            res.status(201).send({token})
            
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }
}