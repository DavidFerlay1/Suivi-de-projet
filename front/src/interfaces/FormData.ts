export interface ResetPasswordFormData {
    token: string,
    password: {
        first: string,
        second: string
    }
}

export interface Credentials {
    username: string,
    password: string
}