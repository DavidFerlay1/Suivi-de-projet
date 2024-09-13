import Dialog from "@components/dialogs/dialog/Dialog"
import { Notification } from "@interfaces/Notification"
import React, { useRef, useState } from "react"
import NotificationItem, { NotificationHandle } from "../NotificationItem"
import { useTranslation } from "react-i18next"
import InvitationDialog from "@components/dialogs/invitationDialog/InvitationDialog"
import './calendarInvitationNotificationItem.scss'
import { IoMdCalendar, IoMdInformation, IoMdInformationCircle, IoMdLink, IoMdOpen, IoMdOptions } from "react-icons/io"
import { LuCalendar } from "react-icons/lu"

type CalendarInvitationNotificationItemProps = {
    notification: Notification,
}

const CalendarInvitationNotificationItem = ({notification}: CalendarInvitationNotificationItemProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const {t} = useTranslation();

    const notifRef = useRef<NotificationHandle>(null);

    const onTitleClick = () => {
        setDialogOpen(true);
    }

    const onInvitationResponse = () => {
        if(notifRef.current)
            notifRef.current.closeNotif();
    }

    return (
        <>
            <NotificationItem id={notification.id} ref={notifRef}>
                <div className="default-presentation-wrapper">
                    <div className="icon-wrapper">
                        <LuCalendar />
                    </div>
                    <p className="eventInfo">   
                        {notification.content}<span className="title-button" onClick={onTitleClick}>{notification.extra_data.event.title} <IoMdOpen /></span>
                    </p>
                </div>  
            </NotificationItem>
            <InvitationDialog onResponse={onInvitationResponse} isOpen={dialogOpen} setIsOpen={setDialogOpen} invitationId={notification.extra_data.invitationId} event={notification.extra_data.event} />
        </>
    )
}

export default CalendarInvitationNotificationItem;