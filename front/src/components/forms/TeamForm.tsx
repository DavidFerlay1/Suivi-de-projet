import React, { useMemo, useState } from "react";
import {Team} from '../../interfaces/Team';
import PersonalSelector from "../PersonalSelector/PersonalSelector";
import { SubmittablePersonal } from "../../interfaces/Personal";
import Form, { CatchableField } from "../Form/Form";
import useApi from "../../hooks/useApi";
import { useTranslation } from "react-i18next";

const TeamForm = ({value}) => {

    const {t} = useTranslation();

    const [values, setValues] = useState<Team>(value)

    const {teamApi} = useApi();

    const canSubmit = useMemo(() => {
        return values.name !== '';
    }, [values])

    const onSubmit = () => {
        teamApi.editOrCreate(values).then(() => {
            console.log("ok");
        }).catch(() => {

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
            <PersonalSelector value={values.members} onChange={onMembersChange} />
        </Form>
    )
}

export default TeamForm