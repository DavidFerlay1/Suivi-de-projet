import React, { useEffect, useState } from "react"
import usePermissions from "../../../../hooks/usePermissions"
import useApi from "../../../../hooks/useApi";
import { RoleProfile } from "../../../../interfaces/Personal";
import AccessControlledLayout from "../../../../components/layouts/authLayouts/AccessControlledLayout";
import './roleMonitoringHomePage.scss'
import RoleProfileList from "./components/RoleProfileList";

const RoleMonitoringHomePage = () => {

    const {requirePermissions} = usePermissions();
    const {personalApi} = useApi();
    const [roleProfiles, setRoleProfiles] = useState<RoleProfile[]>([]);

    useEffect(() => {
        const init = async () => {
            await requirePermissions(['ROLE_PERSONAL_ROLE']);
            try {
                setRoleProfiles((await personalApi.getAllRoleProfiles()).data);
            } catch (e) {
                console.log(e);
            }
        }

        init();
    }, [])



    return (
        <AccessControlledLayout roles={['ROLE_PERSONAL_ROLE_ACCESS']}>
            <span>Bonsoir</span>
            <RoleProfileList roleProfiles={roleProfiles} />
        </AccessControlledLayout>
    )
}

export default RoleMonitoringHomePage;