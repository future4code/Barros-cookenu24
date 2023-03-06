import { UserRepository } from "../business/UserRepository"
import { CustomError } from "../error/CustomError"
import { insertFollowerDTO, returnFollowingUsersDTO, updatePasswordDTO, User } from "../model/User"
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


    getAllUsers = async (search: string): Promise<any> => {
        try {
            return await BaseDatabase.connection(this.TABLE_NAME).select().where("name", "like", `%${search}%`)
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


    unfollowUser = async (userId: string): Promise<void> => {
        try {
            await BaseDatabase.connection("cookenu_followers").where("fk_user_id", userId).delete()
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    getFollowingUsers = async (id: string): Promise<returnFollowingUsersDTO[]> => {
        try {
            return await BaseDatabase.connection("cookenu_followers").select("fk_user_id").where("fk_follower_id", id)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    searchFollowers = async (userId: string, followerId: string): Promise<any> => {
        try {
            return await BaseDatabase.connection("cookenu_followers").select().where({"fk_user_id": userId, "fk_follower_id": followerId})
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    deleteAccount = async (userId: string): Promise<void> => {
        try {
            await BaseDatabase.connection("cookenu_recipes").delete().where("fk_user_id", userId)
            await BaseDatabase.connection("cookenu_followers").delete().where("fk_follower_id", userId)
            await BaseDatabase.connection(this.TABLE_NAME).delete().where("id", userId)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }


    recoverPassword = async (updatePassword: updatePasswordDTO): Promise<void> => {
        try {
            await BaseDatabase.connection(this.TABLE_NAME).update("password", updatePassword.password).where("id", updatePassword.id)
        } catch (err: any) {
            throw new CustomError(err.statusCode, err.message)
        }
    }
}