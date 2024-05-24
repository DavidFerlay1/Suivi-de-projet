export interface Personal {
    id?: number,
    lastName: string,
    firstname: string,
    username: string,
    hasAccount: boolean,
    roleProfileIds: string[]
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
    roleProfiles: RoleProfile[],
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
