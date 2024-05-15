import { useTranslation } from "react-i18next"
import { ProjectStatus, ProjectTask } from "../../../../interfaces/Project"
import React, { useEffect, useMemo, useState } from "react"
import AchievementProgressBar from "../achievementProgressBar/AchievementProgressBar"

type ProjectTaskProps = {
    task: ProjectTask
}

const ProjectTaskItem = ({task}: ProjectTaskProps) => {

    const {t} = useTranslation();

    const onAchieveClick = () => {

    }
 
    return (
        <li>
            <label>{task.title}</label>
            <span className="status">{t(`project.status.type${task.status}`)}</span>
            <p>{task.description || t('empty.description')}</p>
            <AchievementProgressBar target={task} />
            <button onClick={onAchieveClick}>Terminé</button>
        </li>
    )
}

export default ProjectTaskItem;