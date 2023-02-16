export enum USER_ROLE {
    ADMIN = "ADMIN",
    NORMAL = "NORMAL"
}

export class User {
    constructor (private id: string, private email: string, private name: string, private password: string, private role: USER_ROLE) {
        this.id = id
        this.email = email
        this.name = name
        this.password = password
        this.role = role
    }
}

export interface inputSignupDTO {
    name: string,
    email: string,
    password: string,
    role: USER_ROLE
}

export interface inputLoginDTO {
    email: string,
    password: string
}

export interface returnUserInfoDTO {
    id: string,
    name: string,
    email: string
}

export interface inputFollowUserDTO {
    userId: string,
    token: string
}

export interface inputGetUserByIdDTO {
    userId: string,
    token: string
}

export interface inputDeleteAccountDTO {
    userId: string,
    token: string
}

export interface insertFollowerDTO {
    id: string,
    fk_user_id: string,
    fk_follower_id: string
}

export interface returnFollowingUsersDTO {
    fk_user_id: string
}

export interface updatePasswordDTO {
    id: string,
    password: string
}