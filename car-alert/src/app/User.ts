export class User {
    _id: string;
    username: string;
    password: string;
    email: string;
    role: Role;

    public constructor(username: string, password: string, email: string, role: Role = Role.Regular) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }
}

export enum Role {
    Regular = 'regular', Admin = 'admin'
}
