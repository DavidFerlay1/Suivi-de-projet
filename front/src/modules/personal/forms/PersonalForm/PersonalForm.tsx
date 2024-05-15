import React, { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { RoleProfile, SubmittablePersonal } from "../../../../interfaces/Personal"
import { useTranslation } from "react-i18next"
import Form, { CatchableField } from "../../../../components/Form/Form"
import SwitchControl from "../../../../components/formControls/SwitchControl/SwitchControl"
import useApi from "../../../../hooks/useApi"
import { useDispatch } from "react-redux"
import { updateProfile } from "../../../../store/slices/personalSlice"

type PersonalFormProps = {
    target?: SubmittablePersonal,
    handleParentPopupEndEvent?: Function
}

const PersonalForm = ({target, handleParentPopupEndEvent}: PersonalFormProps) => {
    const [values, setValues] = useState<SubmittablePersonal>(target || {
        firstname: '',
        lastName: '',
        roleProfileIds: [],
        createAccount: false,
        username: '',
        hasAccount: false,
    })

    const [roleProfiles, setRoleProfiles] = useState<RoleProfile[]>([]);
    const dispatch = useDispatch();

    const {t} = useTranslation();
    const {personalApi} = useApi();

    const canSubmit = useMemo(() => {
        return true;
    }, [values])

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        })
    }

    const onRoleProfilesEdit = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
        setValues({
            ...values,
            roleProfileIds: selectedIds
        })
    }

    const onSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const id = (await personalApi.createEditProfile(values)).data;
            const isNew = values.id === undefined;
            dispatch(updateProfile({data: {...values, id, hasAccount: values.hasAccount || values.createAccount}, isNew}));
            if(handleParentPopupEndEvent)
                handleParentPopupEndEvent();
        } catch(e) {
            console.log(e);
        }
        
    }

    useEffect(() => {
        personalApi.getAllRoleProfiles().then(res => {
            setRoleProfiles(res.data);
        }).catch(e => console.log(e));
    }, [])

    useEffect(() => {
        if(!values.createAccount && !values.hasAccount) {
            setValues({
                ...values,
                roleProfileIds: []
            })
        }
    }, [values.createAccount, values.hasAccount])

    return (
        <Form canSubmit={canSubmit} onSubmit={onSubmit}>
            <CatchableField label={t('personal.username')}>
                <input readOnly={values.hasAccount} className="field" type="text" name='username' value={values.username} onChange={onEdit} />
            </CatchableField>
            <div className="">
                <CatchableField label={t('personal.firstname')}>
                    <input className="field" type="text" name='firstname' value={values.firstname} onChange={onEdit} />
                </CatchableField>
                <CatchableField label={t('personal.lastName')}>
                    <input className="field" type="text" name='lastName' value={values.lastName} onChange={onEdit} />
                </CatchableField>
            </div>
            {!values.hasAccount && (
                <CatchableField label={t('personal.createAccount')}>
                    <SwitchControl value={values.createAccount} onChange={onEdit} name="createAccount" />
                </CatchableField> )
            }
            {values.hasAccount || values.createAccount && (
                <CatchableField label={t('personal.roles')}>
                    <select multiple={true} onChange={onRoleProfilesEdit} name='roles' value={values.roleProfileIds}>
                        {roleProfiles.map(role => <option value={role.id} key={role.id}>{t(`roles.${role.name}`)}</option>)}
                    </select>
                </CatchableField> )
            }
        </Form>
    )
}

export default PersonalForm;