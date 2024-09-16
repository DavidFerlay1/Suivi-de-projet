import React, { useEffect} from "react"
import useApi from "@hooks/useApi";
import './personalMonitoringHomePage.scss'
import AccessControlledLayout from "@components/layouts/security/AccessControlledLayout";
import ProfileList from "../../components/ProfileList/ProfileList";
import usePermissions from "@hooks/usePermissions";
import QueryContextLayout from "@components/layouts/QueryContextLayout/QueryContextLayout";
import { AccessContextProvider } from "@contexts/AccessContext";

const PersonalMonitoringHomePage = () => {
    const {personalApi} = useApi();
    
    return (
        <AccessControlledLayout roles={['ROLE_MODULE_PERSONAL']}>
            <AccessContextProvider required={['ROLE_PERSONAL_PROFILE_CRUD']}>
                <QueryContextLayout apiFetchCallback={personalApi.getList} defaultSortSetting={{field: 'lastName', sort: 'ASC'}}>
                    <ProfileList />
                </QueryContextLayout>  
            </AccessContextProvider>
                   
        </AccessControlledLayout>
        
    )
}

export default PersonalMonitoringHomePage;