import React, { useMemo, useState } from "react";
import {Team} from '@interfaces/Team';
import PersonalSelector from "../../PersonalSelector/PersonalSelector";
import { SubmittablePersonal } from "@interfaces/Personal";
import Form, { CatchableField } from "../Form";
import useApi from "@hooks/useApi";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';

type TeamFormProps = {
    value: Team,
    onSuccess: Function
}

const TeamForm = ({value, onSuccess}: TeamFormProps) => {

    const {t} = useTranslation();

    const [values, setValues] = useState<Team>(value)

    const {teamApi} = useApi();

    const canSubmit = useMemo(() => {
        return values.name !== '';
    }, [values])

    const onSubmit = () => {
        teamApi.editOrCreate(values).then(() => {
            onSuccess();
        }).catch(err => {
            for(const key of Object.keys(err.response.data)) {
                toast(t(err.response.data[key]), {type: 'error'});
            }
        })
    }

    const onMembersChange = (members: SubmittablePersonal[]) => {
        setValues({
            ...values,
            members
        })
    }

    return (
        <Form onSubmit={onSubmit} canSubmit={canSubmit} >
            <CatchableField label={t('team.name')}>
                <input className="field" value={values.name} onChange={e => setValues({...values, name: e.target.value})}/>
            </CatchableField>
            <PersonalSelector value={values.members} onChange={onMembersChange} additionalFilters={{fb_module_access: 'PROJECT'}} />
        </Form>
    )
}

export default TeamForm