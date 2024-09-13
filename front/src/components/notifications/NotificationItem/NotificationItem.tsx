import useApi from "@hooks/useApi"
import { Notification, NotificationType } from "@interfaces/Notification"
import { removeNotification } from "@store/slices/notificationSlice"
import React, { ReactNode, forwardRef, useImperativeHandle } from "react"
import { IoMdAlert, IoMdCheckmark } from "react-icons/io"
import { useDispatch } from "react-redux"
import './notificationItem.scss'
import { useTranslation } from "react-i18next"
 
type NotificationItemProps = {
    children: ReactNode,
    id: number
}

export type NotificationHandle = {
    closeNotif: () => void
}

const NotificationItem = forwardRef(({children, id}: NotificationItemProps, ref) => {

    const {notificationApi} = useApi();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useImperativeHandle(ref, () => ({
        closeNotif: async () => {
            await setAsReaded()
        }
    }));

    const setAsReaded = async () => {
        notificationApi.setAsReaded(id).then(() => {
            dispatch(removeNotification(id));
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="notification-item">
            {children}
            <button onClick={setAsReaded} className="readed">{t('misc.setAsReaded')}</button>
        </div>
    )
})

export default NotificationItem