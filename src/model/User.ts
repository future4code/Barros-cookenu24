enum USER_ROLE {
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