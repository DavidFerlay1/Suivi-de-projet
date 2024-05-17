import React, { useEffect, useState } from 'react';
import './header.scss';
import useApi from '../../../hooks/useApi';
import { useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import BreadCrumb from '../BreadCrumb/BreadCrumb';

const Header = () => {

    const {authApi} = useApi();
    const navigate = useNavigate();
    const {revokeTokens, getPayload} = useAuth();

    const onLogout = async () => {
        await authApi.logout();
        revokeTokens();
        navigate('/auth');
    }

    const [payload, setPayload] = useState(null);

    useEffect(() => {
        setPayload(getPayload());
    }, [])

    return (
        <header>
            <BreadCrumb />
            <div>
                {payload && payload.username}
                <button onClick={onLogout}>Log out</button>
            </div>
        </header>
    )
}



export default Header