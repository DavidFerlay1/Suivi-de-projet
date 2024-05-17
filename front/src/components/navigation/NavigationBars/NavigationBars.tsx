import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import AuthenticatedLayout from "../../layouts/authLayouts/AuthenticatedLayout";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

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
            <Header />
            <Sidebar />
        </AuthenticatedLayout>
    )
}

export default NavigationBars;