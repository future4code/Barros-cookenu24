import { insertFollowerDTO, returnFollowingUsersDTO, updatePasswordDTO, User } from "../model/User"


export interface UserRepository {
    signup (newUser: User): Promise<void>
    getAllUsers (search: string): Promise<any>
    getUserBy (column: string, value: string): Promise<any>
    followUser (newFollower: insertFollowerDTO): Promise<void>
    unfollowUser (userId: string): Promise<void>
    getFollowingUsers (id: string): Promise<returnFollowingUsersDTO[]>
    searchFollowers (userId: string, followerId: string): Promise<any>
    deleteAccount (userId: string): Promise<void>
    recoverPassword (updatePassword: updatePasswordDTO): Promise<void>
}