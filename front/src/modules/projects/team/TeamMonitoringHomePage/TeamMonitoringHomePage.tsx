import React from "react";
import TeamList from "../../components/TeamList/TeamList";
import QueryContextLayout from "@components/layouts/QueryContextLayout/QueryContextLayout";
import useApi from "@hooks/useApi";
import AccessControlledLayout from "@components/layouts/security/AccessControlledLayout";

const TeamMonitoringHomePage = () => {

    const {teamApi} = useApi();

    return (
        <AccessControlledLayout roles={['ROLE_MODULE_PROJECT', 'ROLE_PROJECT_TEAM_ACCESS']}>
            <QueryContextLayout defaultSortSetting={{field: 'name', sort: 'ASC'}} apiFetchCallback={teamApi.getList}>
                <TeamList />
            </QueryContextLayout>
        </AccessControlledLayout>
        
        
    )
}

export default TeamMonitoringHomePage;