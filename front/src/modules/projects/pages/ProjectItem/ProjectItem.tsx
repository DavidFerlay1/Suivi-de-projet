import React, { useMemo } from 'react';
import { Project } from '../../../../interfaces/Project';
import './projectItem.scss';
import StatusTag from '../../../../components/StatusTag/StatusTag';

type ProjectCardProps = {
    data: Project
}


const ProjectItem = ({data}: ProjectCardProps) => {

    const litteralDuration = useMemo(() => {
        return Math.round((data.duration || 0) / 3600);
    }, [data.duration])


    return (
        <div className="project-item">
            <h2>{data.title}</h2>
            <div className='overview'>
                <StatusTag status={data.status} />
                <div>Nombre de tâches: {data.tasks.length}</div>
                <div>Poids total: {data.weight}</div>
                <div>Durée estimée: {litteralDuration} jours</div>
            </div>
            <button>Ouvrir</button>
        </div>
    )
}

export default ProjectItem;