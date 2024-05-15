import { Project } from "../Project";

export interface Paginated {
    data: Project,
    total: number,
    loaded: number,
    perPage: number,
    page: number
}

export interface PaginationSettings {
    total: number,
    loaded: number,
    perPage: number,
    page: number
}