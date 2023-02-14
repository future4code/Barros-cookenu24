import { UserRepository } from "../business/UserRepository"
import { CustomError } from "../error/CustomError"
import { insertFollowerDTO, User } from "../model/User"
import { BaseDatabase } from "./BaseDatabase"


export class UserDatabase extends BaseDatabase implements UserRepository {
    TABLE_NAME = "cookenu_users"
    
    signup = async (newUser: User): Promise<void> => {
        try {
            await BaseDatabase.connection(this.TABLE_NAME).insert(newUser)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getUserBy = async (column: string, value: string): Promise<any> => {
        try {
            const result = await BaseDatabase.connection(this.TABLE_NAME).select().where(column, value)
            return result[0]
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    followUser = async (newFollower: insertFollowerDTO): Promise<void> => {
        try {
            await BaseDatabase.connection("cookenu_followers").insert(newFollower)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}