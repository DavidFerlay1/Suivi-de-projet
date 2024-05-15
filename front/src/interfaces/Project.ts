import { Tag } from "./Tag"

export enum ProjectInterfaceType {
    PROJECT,
    TASK
}

export enum ProjectStatus {
    TODO = -1,
    IN_PROGRESS = 0,
    ACHIVIED = 1,
    CLOSED = 2
}

export interface Project {
    id?: number,
    title: string,
    description?: string,
    tasks: ProjectTask[],
    status: number,
    tags: Tag[],
    weight?: number,
    duration?: number,
    type: ProjectInterfaceType.PROJECT
}

export interface SubmittableProject {
    id?: number,
    title: string,
    description?: string,
    tasks: ProjectTask[],
    status: number,
    tags: Tag[],
    weight?: number,
    duration?: number,
}

export interface ProjectTask {
    id?: number,
    title: string,
    description?: string,
    tasks: ProjectTask[],
    status: number,
    tags: Tag[],
    parent?: LiteProjectTask,
    weight?: number,
    duration?: number,
    type: ProjectInterfaceType.TASK
}

export interface LiteProjectTask {
    id?: number,
    title: string,
    status: number,
    parent?: LiteProjectTask
}