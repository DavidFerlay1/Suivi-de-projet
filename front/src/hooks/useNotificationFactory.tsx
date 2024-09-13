import CalendarInvitationNotificationItem from "@components/notifications/NotificationItem/CalendarInvitationNotificationItem/CalendarInviationNotificationItem";
import { Notification, NotificationType } from "@interfaces/Notification"
import React from "react";

const useNotificationFactory = () => {

    const render = (notification: Notification) => {
        switch(notification.type) {
            case NotificationType.CALENDAR: return <CalendarInvitationNotificationItem key={notification.id} notification={{...notification, extra_data: JSON.parse('extraData' in notification ? notification.extraData : notification.extra_data)}} />
            default: return null;
        }
    }

    return {render}
}

export default useNotificationFactory;