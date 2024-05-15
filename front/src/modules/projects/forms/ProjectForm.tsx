import { FormEvent, useMemo, useState } from "react"
import { Project, ProjectInterfaceType, ProjectStatus } from "../../../interfaces/Project"
import { useTranslation } from "react-i18next"
import React from "react"
import DurationControl from "../../../components/formControls/DurationControl"
import useApi from '../../../hooks/useApi';

type ProjectFormProps = {
    target?: Project
}

const ProjectForm = ({target}: ProjectFormProps) => {

    const {t} = useTranslation();
    const {projectApi} = useApi();

    const [project, setProject] = useState<Project>(target || {
        tags: [],
        tasks: [],
        title: '',
        description: '',
        weight: undefined,
        type: ProjectInterfaceType.PROJECT,
        status: ProjectStatus.IN_PROGRESS
    });

    const canSubmit = useMemo(() => {
        return project.title && project.type !== undefined && project.status !== undefined
    }, [project])

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        projectApi.create(project)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    // Any type can match with all event types, DO NOT CHANGE
    const onEdit = (e:any) => {
        setProject({
            ...project,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        })
    }

    const onEditCustom = (name: string, value: any) => {
        setProject({
            ...project,
            [name]: value
        })
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>{t('misc.title')}</label>
                <input className="field" type="text" name='title' value={project.title} onChange={onEdit} />
            </div>
            <div className="form-group">
                <label>{t('misc.description')}</label>
                <textarea placeholder={t('misc.facultatif')} className="field" onChange={onEdit}>

                </textarea>
            </div>
            <div className="form-groups">
                <div className="form-group">
                    <label>{t('misc.weight')}</label>
                    <input placeholder={t('misc.facultatif')} className="field" name='weight' type="number" min={0} onChange={onEdit} />
                </div>
                <DurationControl value={project.duration} onChange={(value: number) => onEditCustom('duration', value)} />
            </div>
            
            <button disabled={!canSubmit}>Esti d'criss de calice</button>
        </form>
    )
}

export default ProjectForm;