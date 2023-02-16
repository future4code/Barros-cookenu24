import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { inputDeleteAccountDTO, inputFollowUserDTO, inputGetUserByIdDTO, inputLoginDTO, inputSignupDTO } from "../model/User"


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


    getUserInfo = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization as string
            const result = await this.userBusiness.getUserInfo(token)

            res.status(200).send(result)
            
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    followUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputFollowUserDTO = {
                userId: req.body.userId,
                token: req.headers.authorization as string
            }

            await this.userBusiness.followUser(input)
            res.status(201).send(`Success! The user is now following the user id ${input.userId}.`)
            
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    unfollowUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputFollowUserDTO = {
                userId: req.body.userId,
                token: req.headers.authorization as string
            }

            await this.userBusiness.unfollowUser(input)
            res.status(201).send(`Success! The user has unfollowed the user id ${input.userId}.`)
            
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputGetUserByIdDTO = {
                userId: req.params.userId,
                token: req.headers.authorization as string
            }

            const result = await this.userBusiness.getUserById(input)
            res.status(200).send(result)
            
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    deleteAccount = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: inputDeleteAccountDTO = {
                userId: req.params.userId,
                token: req.headers.authorization as string
            }

            await this.userBusiness.deleteAccount(input)
            res.status(201).send("Success! The account has been deleted.")
            
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }


    recoverPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = req.body.email

            await this.userBusiness.recoverPassword(email)
            res.status(201).send("Success! An e-mail has been sent to the user.")
            
        } catch (err: any) {
            res.status(err.statusCode || 400).send(err.message || err.sqlMessage)
        }
    }
}