import { insertFollowerDTO, returnFollowingUsersDTO, User } from "../model/User"


export interface UserRepository {
    signup (newUser: User): Promise<void>
    getUserBy (column: string, value: string): Promise<any>
    followUser (newFollower: insertFollowerDTO): Promise<void>
    getFollowingUsers (id: string): Promise<returnFollowingUsersDTO[]>
}