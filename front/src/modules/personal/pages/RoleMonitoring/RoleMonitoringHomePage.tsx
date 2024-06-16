import React, { useEffect } from "react"
import usePermissions from "@hooks/usePermissions"
import useApi from "@hooks/useApi";
import AccessControlledLayout from "@components/layouts/security/AccessControlledLayout";
import QueryContextLayout from '@components/layouts/QueryContextLayout/QueryContextLayout';
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
        <AccessControlledLayout roles={['ROLE_MODULE_PERSONAL', 'ROLE_PERSONAL_ROLE_ACCESS']}>
            <QueryContextLayout defaultSortSetting={{field: 'name', sort: 'ASC'}} apiFetchCallback={personalApi.getAllRoleProfiles}>
                <RoleProfileList />
            </QueryContextLayout>
        </AccessControlledLayout>
    )
}

export default RoleMonitoringHomePage;