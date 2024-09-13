import React, { useEffect, useState } from 'react';
import './header.scss';
import useApi from '@hooks/useApi';
import { useNavigate } from 'react-router';
import useAuth from '@hooks/useAuth';
import BreadCrumb from '../BreadCrumb/BreadCrumb';
import { LuLogOut} from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { IoMdAlert, IoMdNotifications } from 'react-icons/io';
import NotificationDropDown from '@components/notifications/NotificationDropDown/NotificationDropDown';

const Header = () => {

    const {authApi} = useApi();
    const navigate = useNavigate();
    const {revokeTokens, getPayload} = useAuth();

    const onLogout = async () => {
        await authApi.logout();
        revokeTokens();
        navigate('/auth');
    }

    const [payload, setPayload] = useState<any>();

    useEffect(() => {
        const payload = getPayload();
        console.log(payload)
        if(payload)
            setPayload(payload);
    }, [])

    return (
        <header>
            <BreadCrumb />
            <div className='headerUserContext'>
                <NotificationDropDown />
                {payload && payload.username}
                <button className='icon-button' onClick={onLogout}><LuLogOut /></button>
            </div>
        </header>
    )
}



export default Header