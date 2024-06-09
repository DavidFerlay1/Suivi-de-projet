import { SubmittablePersonal } from "./Personal";

export interface Team {
    id?: number,
    name: string,
    members: SubmittablePersonal[]
}
