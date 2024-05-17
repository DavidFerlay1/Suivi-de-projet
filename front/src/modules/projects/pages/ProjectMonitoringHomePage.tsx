import React, { useCallback, useEffect, useState } from "react"
import { Project } from "../../../interfaces/Project";
import useApi from "../../../hooks/useApi";
import Paginator from "../../../components/Paginator/Paginator";
import PaginatedLayout from "../../../components/layouts/PaginatedLayout/PaginatedLayout";
import ProjectItem from "./ProjectItem/ProjectItem";
import AccessControlledLayout from "../../../components/layouts/authLayouts/AccessControlledLayout";

const ProjectMonitoringHomePage = () => {

    const {projectApi} = useApi();
    const [projects, setProjects] = useState<Project[]>([]);
    const [pagination, setPagination] = useState<PaginationSettings>({page: 1, total: 0, loaded: 0, perPage: 0});
    const [init, setInit] = useState(false);

    const updatePageData = useCallback(async (pageIndex = 1) => {
        const {loaded, perPage, page, total, data} = (await projectApi.getAll(pageIndex)).data;
        setPagination({loaded, perPage, page, total});
        setProjects(data);
        setInit(true);
    }, [pagination, projects]);

    useEffect(() => {
        updatePageData();
    }, [])

    return (
        <AccessControlledLayout roles={['ROLE_MODULE_PROJECT']}>
            <PaginatedLayout>
                {init ? 
                    (
                        <>
                            {projects.length ? projects.map(project => <ProjectItem key={project.id} data={project} />) : <span>Aucun projet</span>}
                        </> 
                    ) : <span>Loading</span>
                }
                
            </PaginatedLayout>
        </AccessControlledLayout>
        
        
    )
}
export default ProjectMonitoringHomePage;