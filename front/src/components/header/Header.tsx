import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import './header.scss';
import {CiAirportSign1, CiCalendar, CiDollar, CiHome, CiPaperplane, CiSettings, CiUser} from 'react-icons/ci';
import useApi from '../../hooks/useApi';
import { useLocation, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";
import AuthenticatedLayout from '../layouts/authLayouts/AuthenticatedLayout';

type SidebarProps = {
    onModuleChange: Function
}

type HeaderProps = {
    currentModule: string
}

const Sidebar = ({onModuleChange}: SidebarProps) => {

    const navigate = useNavigate();

    const onIconClick = (uri: string, title: string) => {
        onModuleChange(title)
        navigate(uri);
    }

    const [moduleIcons] = useState({
        ROLE_MODULE_PROJECT: <CiPaperplane key='PROJECT' size={26} color='white' onClick={() => onIconClick('/project', 'Projets')} />,
        ROLE_MODULE_PERSONAL: <CiUser key='PERSONAL' size={26} color='white' onClick={() => onIconClick('/personal', 'Personnel')} />
    })

    const {authApi} = useApi();
    const [userModuleAccesses, setUserModuleAccesses] = useState<string[]>([]);

    const isSuperAdmin = useMemo(() => {
        return userModuleAccesses.includes('ROLE_SUPERADMIN');
    }, [userModuleAccesses])

    useEffect(() => {
        authApi.getModuleAccesses().then(res => {
            setUserModuleAccesses(res.data);
        })
    }, [])

    return (
        <nav>
            <CiHome key='HOME' size={26} color='white' onClick={() => onIconClick('/', 'Tableau de bord')} />
            {isSuperAdmin ? Object.keys(moduleIcons).map((icon, index) => moduleIcons[icon]) : (
                userModuleAccesses.map((moduleAccess) => moduleIcons[moduleAccess])
            )}
        </nav>
    )
}

const Header = ({currentModule}: HeaderProps) => {

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

type BreadCrumbData = {
    name: string,
    uri?: string
}

const BreadCrumb = () => {

    const location = useLocation();
    const {t} = useTranslation();

    const breadCrumbData = useMemo<BreadCrumbData[]>(() => {
        if(location.pathname === '/')
            return [{name: t('routes.dashboard.name')}];
        const splitted = location.pathname.split('/');
        splitted.shift();
        const path: string[] = [];

        const data: BreadCrumbData[] = [{name: t(`routes.${splitted[0]}.name`)}];

        for(let i = 1; i < splitted.length; i++) {
            path.push(splitted[i]);
            data.push({name: t(`routes.${path.join('.')}.name`), uri: path.join('/')})
        }

        return data;

    }, [location.pathname])

    return breadCrumbData.map(data => data.uri ? <Link to={data.uri}>{data.name}</Link> : <span>{data.name}</span>);
}

const NavigationBars = () => {
    const location = useLocation();
    const [currentModule, setCurrentModule] = useState('');

    const shown = useMemo(() => {
        return !location.pathname.startsWith('/auth');
    }, [location.pathname])

    useEffect(() => {
        document.body.classList.toggle('bordered', shown);
    }, [shown])

    return shown && (
        <AuthenticatedLayout>
            <Header currentModule={currentModule} />
            <Sidebar onModuleChange={(value: string) => setCurrentModule(value)} />
        </AuthenticatedLayout>
    )
}

export default NavigationBars;