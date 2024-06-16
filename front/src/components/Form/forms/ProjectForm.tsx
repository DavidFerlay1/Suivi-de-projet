import React, { useState } from "react"
import Form from "../Form"
import { useTranslation } from "react-i18next";
import useApi from "@hooks/useApi";
import { Project } from "@interfaces/Project";

type ProjectFormProps = {
    project: Project,
    onSuccess: Function
}

const ProjectForm = ({project, onSuccess}: ProjectFormProps) => {

    const {t} = useTranslation();
    const {projectApi} = useApi();

    const [values, setValues] = useState(project);

    const onEdit = (name: string, value: any) => {
        setValues({
            ...values,
            [name]: value
        })
    }

    const onSubmit = async () => {
        try {
            await projectApi.createUpdate(values);
            onSuccess();
        } catch {

        }
    }

    return (
        <Form onSubmit={onSubmit} canSubmit={true}>
            <div className="form-group">
                <label>{t('project.title')}</label>
                <input value={values.title} onChange={e => onEdit('title', e.target.value)} />
            </div>
        </Form>
    )
}

export default ProjectForm