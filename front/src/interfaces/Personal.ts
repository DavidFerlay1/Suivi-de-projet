export interface Personal {
    id?: number,
    lastName: string,
    firstname: string,
    username: string,
    hasAccount: boolean
}

export interface Team {
    id?: number,
    name: string,
    members: Personal[]
}

export interface SubmittablePersonal {
    id?: number,
    lastName: string,
    firstname: string,
    username: string,
    createAccount: boolean,
    roleProfileIds: string[],
    hasAccount: boolean
}

export interface SensitiveSafeSubmittablePersonal {
    lastName: string,
    firstname: string,
    createAccount: boolean,
    readonly hasAccount: boolean
}

export interface RoleProfile {
    id?: string,
    name: string,
    roles: string[]
}