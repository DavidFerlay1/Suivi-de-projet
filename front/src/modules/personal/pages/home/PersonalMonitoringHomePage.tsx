import React, { useEffect} from "react"
import useApi from "@hooks/useApi";
import './personalMonitoringHomePage.scss'
import AccessControlledLayout from "@components/layouts/security/AccessControlledLayout";
import ProfileList from "../../components/ProfileList/ProfileList";
import usePermissions from "@hooks/usePermissions";
import QueryContextLayout from "@components/layouts/QueryContextLayout/QueryContextLayout";

const PersonalMonitoringHomePage = () => {
    const {personalApi} = useApi();
    const {requirePermissions} = usePermissions();

    useEffect(() => {
        const init = async () => {
            await requirePermissions(['ROLE_PERSONAL_PROFILE']);
        }
        init();
    }, [])

    return (
        <AccessControlledLayout roles={['ROLE_MODULE_PERSONAL', 'ROLE_PERSONAL_PERSONAL_ACCESS']}>
            <QueryContextLayout apiFetchCallback={personalApi.getList} defaultSortSetting={{field: 'lastName', sort: 'ASC'}}>
                <ProfileList />
            </QueryContextLayout>         
        </AccessControlledLayout>
        
    )
}

export default PersonalMonitoringHomePage;