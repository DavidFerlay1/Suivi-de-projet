import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './notificationDropDown.scss';
import { IoMdNotifications } from "react-icons/io";
import NotificationItem from "../NotificationItem/NotificationItem";
import { Notification } from "@interfaces/Notification";
import useApi from "@hooks/useApi";
import { removeAll } from "@store/slices/notificationSlice";
import { useTranslation } from "react-i18next";
import useNotificationFactory from "@hooks/useNotificationFactory";

const NotificationDropDown = () => {
    const notifications: Notification[] = useSelector((state: any) => state.notifications.notifications);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const {notificationApi} = useApi();
    const {t} = useTranslation();
    const factory = useNotificationFactory();

    const setAllReaded = () => {
        notificationApi.setAllReaded().then(() => {
            dispatch(removeAll());
        })
    }

    useEffect(() => {
        if(notifications.length === 0)
            setOpen(false)
    }, [notifications])

    return (
        <div className="notification-dropdown-wrapper">
            <IoMdNotifications onClick={() => notifications.length && setOpen(prev => !prev)} size={20} style={{padding: 8}} />
            {notifications.length > 0 && <span className="notification-count">{notifications.length > 9 ? '9+' : notifications.length}</span>}
            {open && (
                <div className="notification-dropdown">
                    {notifications.map(notif => factory.render(notif))}
                    <button onClick={setAllReaded}>{t('misc.setAllReaded')}</button>
                </div>
            )}
        </div>
    )
}

export default NotificationDropDown