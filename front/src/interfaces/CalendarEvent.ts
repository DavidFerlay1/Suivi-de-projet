import { SubmittablePersonal } from "./Personal";

export interface CalendarEvent {
    id?: number,
    title: string,
    description: string,
    beginDateMillis: number,
    endDateMillis: number,
    invitations: SubmittablePersonal[]
}

export interface ApiCalendarEvent {
    id?: number,
    title: string,
    description: string,
    beginDate: number,
    endDate: number,
    invitations: SubmittablePersonal[]
}