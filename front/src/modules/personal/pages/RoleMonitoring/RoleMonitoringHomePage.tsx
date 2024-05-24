import React, { useEffect, useState } from "react"
import usePermissions from "../../../../hooks/usePermissions"
import useApi from "../../../../hooks/useApi";
import AccessControlledLayout from "../../../../components/layouts/authLayouts/AccessControlledLayout";
import QueryContextLayout from '../../../../components/layouts/QueryContextLayout/QueryContextLayout';
import './roleMonitoringHomePage.scss'
import RoleProfileList from "./components/RoleProfileList";

const RoleMonitoringHomePage = () => {

    const {requirePermissions} = usePermissions();
    const {personalApi} = useApi();

    useEffect(() => {
        const init = async () => {
            await requirePermissions(['ROLE_PERSONAL_ROLE']);
        }

        init();
    }, [])



    return (
        <AccessControlledLayout roles={['ROLE_PERSONAL_ROLE_ACCESS']}>

        </AccessControlledLayout>
    )
}

export default RoleMonitoringHomePage;