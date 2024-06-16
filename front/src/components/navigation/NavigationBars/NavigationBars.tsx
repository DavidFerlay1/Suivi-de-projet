import React, { useEffect, useMemo} from "react";
import { useLocation } from "react-router";
import AuthenticatedLayout from "../../layouts/security/AuthenticatedLayout";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const NavigationBars = () => {
    const location = useLocation();

    const shown = useMemo(() => {
        return !location.pathname.startsWith('/auth');
    }, [location.pathname])

    useEffect(() => {
        document.body.classList.toggle('bordered', shown);
    }, [shown])

    return shown && (
        <AuthenticatedLayout>
            <Header />
            <Sidebar />
        </AuthenticatedLayout>
    )
}

export default NavigationBars;