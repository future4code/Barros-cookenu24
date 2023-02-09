import { User } from "../model/User"


export interface UserRepository {
    signup (newUser: User): Promise<void>
    getUserBy (column: string, value: string): Promise<any>
}