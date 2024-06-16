import React, { useContext, useEffect, useState } from 'react'
import './projectList.scss'
import { QueryContext } from '@contexts/QueryContext'
import { Project, ProjectInterfaceType } from '@interfaces/Project';
import MenuBar from '@components/MenuBar/MenuBar';
import Searchbar from '@components/searchbar/Searchbar';
import { useTranslation } from 'react-i18next';
import Dialog from '@components/dialogs/dialog/Dialog';
import ProjectForm from '@components/Form/forms/ProjectForm';

const emptyForm: Project = {
    title: '',
    tasks: [],
    status: 1,
    tags: [],
    type: ProjectInterfaceType.PROJECT
}

const ProjectList = () => {
    const queryContext = useContext(QueryContext);
    const [projects, setProjects] = useState<Project[]>([]);
    const {t} = useTranslation();

    const [editPopupOpen, setEditPopupOpen] = useState(false);
    const [targetProject, setTargetProject] = useState<Project>(emptyForm);

    useEffect(() => {
        queryContext?.fetch().then((result: Project[]) => setProjects(result));
    }, [queryContext?.params])

    const renderSearchbarIterm = (item: Project) => {
        return <div>{item.title}</div>
    }

    const onSubmitSuccess = async () => {
        setProjects(await queryContext?.fetch());
        setEditPopupOpen(false);
        setTargetProject(emptyForm);
    }

    return (
        <div>
            <MenuBar>
                <Searchbar renderItem={renderSearchbarIterm} />
                <button onClick={() => setEditPopupOpen(true)}>{t('project.create')}</button>
            </MenuBar>
            {projects.map(p => (
                <p>{p.title}</p>
            ))}

            <Dialog title={t('project.createTitle')} isModal={true} isOpen={editPopupOpen} setIsOpen={setEditPopupOpen}>
                <ProjectForm onSuccess={onSubmitSuccess} project={targetProject} />
            </Dialog>
        </div>
    )
}

export default ProjectList;