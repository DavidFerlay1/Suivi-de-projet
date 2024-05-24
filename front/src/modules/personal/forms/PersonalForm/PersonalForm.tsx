import React, { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { RoleProfile, SubmittablePersonal } from "../../../../interfaces/Personal"
import { useTranslation } from "react-i18next"
import Form, { CatchableField } from "../../../../components/Form/Form"
import SwitchControl from "../../../../components/formControls/SwitchControl/SwitchControl"
import useApi from "../../../../hooks/useApi"
import { useDispatch } from "react-redux"
import { updateProfile } from "../../../../store/slices/personalSlice"
import RoleSelector from "../../pages/RoleMonitoring/components/RoleSelector/RoleSelector"

type PersonalFormProps = {
    target?: SubmittablePersonal,
    handleParentPopupEndEvent?: Function
}

const PersonalForm = ({target, handleParentPopupEndEvent}: PersonalFormProps) => {
    const [values, setValues] = useState<SubmittablePersonal>({
        firstname: '',
        lastName: '',
        roleProfiles: [],
        createAccount: false,
        username: '',
        hasAccount: false,
        ...target
    })

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

    const onRoleProfilesEdit = (roleProfiles: RoleProfile[]) => {
        setValues({
            ...values,
            roleProfiles
        });
    }

    const onSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log(values)
            const data = (await personalApi.createEditProfile(values)).data;
            const isNew = values.id === undefined;
            const transformId = values.id && values.createAccount ? values.id : undefined;
            dispatch(updateProfile({data, isNew, transformId}));
            if(handleParentPopupEndEvent)
                handleParentPopupEndEvent();
        } catch(e) {
            console.log(e);
        }
    }

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
                {(values.hasAccount || values.createAccount) ? (
                    <CatchableField label={t('personal.roles')}>
                        <RoleSelector value={values.roleProfiles} onChange={onRoleProfilesEdit} />
                    </CatchableField> ) : <></>
                }
        </Form>
    )
}

export default PersonalForm;