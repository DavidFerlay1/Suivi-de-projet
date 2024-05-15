import React, { useEffect, useState } from "react"
import AccessControlledComponent from "../../../../components/accessControledComponent/AccessControlledComponent"
import usePermissions from "../../../../hooks/usePermissions"
import useApi from "../../../../hooks/useApi";

const RoleMonitoringHomePage = () => {

    const {requirePermissions} = usePermissions();
    const {personalApi} = useApi();
    const [roleProfiles, setRoleProfiles] = useState();

    useEffect(() => {
        const init = async () => {
            await requirePermissions(['ROLE_PERSONAL_ROLE']);
            try {
                setRoleProfiles((await personalApi.getAllRoleProfiles()).data);
            } catch (e) {
                console.log(e);
            }
        }
    }, [])

    return (
        <AccessControlledComponent roles={['ROLE_PERSONAL_ROLE_ACCESS']}>

        </AccessControlledComponent>
    )
}