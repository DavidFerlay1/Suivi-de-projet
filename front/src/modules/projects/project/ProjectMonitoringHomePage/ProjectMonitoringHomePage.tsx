import React, { useEffect} from "react"
import useApi from "@hooks/useApi";
import QueryContextLayout from '@components/layouts/QueryContextLayout/QueryContextLayout'
import AccessControlledLayout from "@components/layouts/security/AccessControlledLayout";
import ProjectList from "../../components/ProjectList/ProjectList";

const ProjectMonitoringHomePage = () => {

    const {projectApi} = useApi();

    useEffect(() => {
        console.log("TEST")
    }, [])

    return (
        <AccessControlledLayout roles={['ROLE_MODULE_PROJECT']}>
            <QueryContextLayout apiFetchCallback={projectApi.getList} defaultSortSetting={{sort: 'ASC', field: 'title'}}>
                <ProjectList />
            </QueryContextLayout>
        </AccessControlledLayout>
        
        
    )
}
export default ProjectMonitoringHomePage;