import { CustomError } from "../error/CustomError"
import { DuplicateEmail, DuplicateFollow, EmailNotFound, IncorrectPassword, InvalidEmail, InvalidPassword, InvalidUserId, InvalidUserRole, MissingEmail, MissingPassword, MissingRole, MissingToken, MissingUserId, MissingUserName, NotPossibleToUnfollow, Unauthorized, userNotAllowedToDeleteAccount, UserNotFound } from "../error/userErrors"
import { inputLoginDTO, inputSignupDTO, User, returnUserInfoDTO, inputFollowUserDTO, insertFollowerDTO, inputDeleteAccountDTO, USER_ROLE, updatePasswordDTO, inputGetUserByIdDTO } from "../model/User"
import { Authenticator } from "../services/Authenticator"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { transporter } from "../services/mailTransporter"
import { PasswordGenerator } from "../services/PasswordGenerator"
import { UserRepository } from "./UserRepository"


export class UserBusiness {
    constructor (private userDatabase: UserRepository) {}

    signup = async (input: inputSignupDTO): Promise<string> => {
        try {
            if (!input.email) {
                throw new MissingEmail()
            }
            if (!input.name) {
                throw new MissingUserName()
            }
            if (!input.password) {
                throw new MissingPassword()
            }
            if (!input.role) {
                throw new MissingRole()
            }
            if (input.role.toUpperCase() !== "NORMAL" && input.role.toUpperCase() !== "ADMIN") {
                throw new InvalidUserRole()
            }
            if (!input.email.includes("@")) {
                throw new InvalidEmail()
            }
            if (input.password.length < 6) {
                throw new InvalidPassword()
            }

            const duplicateEmail = await this.userDatabase.getUserBy("email", input.email)
            if (duplicateEmail) {
                throw new DuplicateEmail()
            }

            const hashManager = new HashManager()
            const hashPassword = await hashManager.generateHash(input.password)

            const id = new IdGenerator().generateId()
            const newUser = new User(id, input.email, input.name, hashPassword, input.role)
            
            await this.userDatabase.signup(newUser)
            
            const authenticator = new Authenticator()
            const token = authenticator.generateToken({id, role: input.role})
            
            return token

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    login = async (input: inputLoginDTO): Promise<string> => {
        try {
            if (!input.email) {
                throw new MissingEmail()
            }
            if (!input.password) {
                throw new MissingPassword()
            }
            if (!input.email.includes("@")) {
                throw new InvalidEmail()
            }
            if (input.password.length < 6) {
                throw new InvalidPassword()
            }

            const userEmail = await this.userDatabase.getUserBy("email", input.email)
            if(!userEmail) {
                throw new EmailNotFound()
            }

            const hashPassword = new HashManager()
            const comparePassword = await hashPassword.compareHash(input.password, userEmail.password)
            
            if (!comparePassword) {
                throw new IncorrectPassword()
            }

            const authenticator = new Authenticator()
            const token = await authenticator.generateToken({id: userEmail.id, role: userEmail.role})
            
            return token

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getAccountInfo = async (token: string): Promise<returnUserInfoDTO> => {
        try {
            if (!token) {
                throw new MissingToken()
            }

            const authenticator = new Authenticator()
            const tokenIsValid = await authenticator.getTokenData(token)

            if (!tokenIsValid) {
                throw new Unauthorized()
            }

            const user = await this.userDatabase.getUserBy("id", tokenIsValid.id)
            
            const result: returnUserInfoDTO = {
                id: user.id,
                name: user.name,
                email: user.email
            }

            return result

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    followUser = async (input: inputFollowUserDTO): Promise<void> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            if (!input.userId) {
                throw new MissingUserId()
            }

            const userIdExists = await this.userDatabase.getUserBy("id", input.userId)
            if (!userIdExists) {
                throw new UserNotFound()
            }

            const authenticator = new Authenticator()
            const tokenIsValid = await authenticator.getTokenData(input.token)

            if (!tokenIsValid) {
                throw new Unauthorized()
            }

            if (tokenIsValid.id === input.userId) {
                throw new InvalidUserId()
            }

            const findUser = await this.userDatabase.searchFollowers(input.userId, tokenIsValid.id)
            if (findUser.length > 0) {
                throw new DuplicateFollow()
            }

            const id = await new IdGenerator().generateId()

            const newFollower: insertFollowerDTO = {
                id,
                fk_user_id: input.userId,
                fk_follower_id: tokenIsValid.id
            }

            await this.userDatabase.followUser(newFollower)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    unfollowUser = async (input: inputFollowUserDTO): Promise<void> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            if (!input.userId) {
                throw new MissingUserId()
            }

            const userIdExists = await this.userDatabase.getUserBy("id", input.userId)
           
            if (!userIdExists) {
                throw new UserNotFound()
            }

            const authenticator = new Authenticator()
            const tokenIsValid = await authenticator.getTokenData(input.token)

            if (!tokenIsValid) {
                throw new Unauthorized()
            }

            if (tokenIsValid.id === input.userId) {
                throw new InvalidUserId()
            }

            const findUser = await this.userDatabase.searchFollowers(input.userId, tokenIsValid.id)
            if (findUser.length === 0) {
                throw new NotPossibleToUnfollow()
            }

            await this.userDatabase.unfollowUser(input.userId)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getUserById = async (input: inputGetUserByIdDTO): Promise<returnUserInfoDTO> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            if (!input.userId) {
                throw new MissingUserId()
            }

            const userIdExists = await this.userDatabase.getUserBy("id", input.userId)
            if (!userIdExists) {
                throw new UserNotFound()
            }

            const authenticator = new Authenticator()
            const tokenIsValid = await authenticator.getTokenData(input.token)

            if (!tokenIsValid) {
                throw new Unauthorized()
            }

            const result: returnUserInfoDTO = {
                id: userIdExists.id,
                name: userIdExists.name,
                email: userIdExists.email
            }

            return result

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    deleteAccount = async (input: inputDeleteAccountDTO): Promise<void> => {
        try {
            if (!input.token) {
                throw new MissingToken()
            }

            if (!input.userId) {
                throw new MissingUserId()
            }

            const userIdExists = await this.userDatabase.getUserBy("id", input.userId)
            if (!userIdExists) {
                throw new UserNotFound()
            }

            const authenticator = new Authenticator()
            const tokenIsValid = await authenticator.getTokenData(input.token)

            if (!tokenIsValid) {
                throw new Unauthorized()
            }

            if (tokenIsValid.role.toUpperCase() !== USER_ROLE.ADMIN) {
                throw new userNotAllowedToDeleteAccount()
            }

            await this.userDatabase.deleteAccount(input.userId)

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    recoverPassword = async (email: string): Promise<void> => {
        try {
            if (!email) {
                throw new MissingEmail()
            }
        
            const emailExists = await this.userDatabase.getUserBy("email", email)
            if (!emailExists) {
                throw new EmailNotFound()
            }

            const newPassword = new PasswordGenerator().generatePassword()
            const hashManager = new HashManager()
            const hashPassword = await hashManager.generateHash(newPassword)

            const updatePassword: updatePasswordDTO = {
                id: emailExists.id,
                password: hashPassword
            }

            await this.userDatabase.recoverPassword(updatePassword)
            
            await transporter.sendMail({
                from: process.env.NODEMAILER_USER,
                to: email,
                subject: "Cookenu - Recuperação de senha",
                text: `Conforme solicitado, segue a nova senha gerada: ${newPassword}`,
                html: `<p>Conforme solicitado, segue a nova senha gerada: ${newPassword}</p>`
            })

        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}