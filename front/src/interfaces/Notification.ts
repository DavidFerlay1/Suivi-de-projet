export interface Notification {
    id: number,
    content: any,
    type: string,
    extra_data?: any
}

export const NotificationType = {
    CALENDAR: 'calendar'
}