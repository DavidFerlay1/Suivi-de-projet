import React, { useMemo } from "react"
import { Project, ProjectStatus } from "../../../interfaces/Project"
import {useTranslation} from "react-i18next";
import ProjectTaskItem from "../projectTask/ProjectTaskItem";
import ProgressBar from "../../../components/progressBar/ProgressBar";
import AchievementProgressBar from "../achievementProgressBar/AchievementProgressBar";
import './projectItem.scss'
import CollapsibleLayout from "../../../components/layouts/collapsibleLayout/CollapsibleLayout";
import ToggleDialog from "../../../components/dialogs/toggles/toggleDialog/ToggleDialog";
import AccessControlledComponent from "../../../components/accessControledComponent/AccessControlledComponent";
import ProjectForm from "../forms/ProjectForm";

type ProjectItemProps = {
    project: Project
}

const ProjectDetail = ({project}: ProjectItemProps) => {
    const {t} = useTranslation();

    return (
        <AccessControlledComponent needed={'ROLE_TEST'}>
            <div className="project-item">
                <h3>{project.title}</h3>
                <div className="menu-bar">
                    <div className="overview">
                        <div className="project-achievement-bar">
                            <AchievementProgressBar target={project} />
                        </div>
                        {project.description && 
                            <ToggleDialog title={t('misc.description')} isModal={false}>
                                {project.description}
                            </ToggleDialog>
                        }
                    </div>
                    <div className="adminOptions">
                        <ToggleDialog confirmClose={true} className="large" title={t('misc.edit')} isModal={false}>
                            <ProjectForm target={project} />
                            <ToggleDialog title="Sur ?" isModal={true}>data</ToggleDialog>
                        </ToggleDialog>
                    </div>   
                </div>
                
              
                <CollapsibleLayout title="Tâches">
                    <ul>
                        {project.tasks.map((task, index) => <ProjectTaskItem task={task} key={index} />)}
                    </ul>
                </CollapsibleLayout>
                
            </div>
        </AccessControlledComponent>
        
    )
}

export default ProjectDetail;