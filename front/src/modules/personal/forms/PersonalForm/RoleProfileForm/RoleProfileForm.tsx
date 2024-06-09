import React, { ChangeEvent, useEffect, useState } from "react"
import useApi from "../../../../../hooks/useApi";
import { RoleProfile, SubmittablePersonal } from "../../../../../interfaces/Personal";
import RoleOrganizer from "./RoleOrganizer";
import Form, { CatchableField } from "../../../../../components/Form/Form";
import { useTranslation } from "react-i18next";
import Dialog from "../../../../../components/dialogs/dialog/Dialog";
import RoleSelector from "../../../pages/RoleMonitoring/components/RoleSelector/RoleSelector";
import PersonalSelector from "../../../../../components/PersonalSelector/PersonalSelector";

type RoleProfileFormProps = {
    profile?: RoleProfile,
    onSuccess: Function
}

const RoleProfileForm = ({profile, onSuccess}: RoleProfileFormProps) => {

    const {personalApi} = useApi();
    const [values, setValues] = useState<RoleProfile>(profile || {
        name: '',
        roles: []
    })
    const [roleForms, setRoleForms] = useState<any>({});
    const {t} = useTranslation();

    const [fromModelPopupOpen, setFromModelPopupOpen] = useState(false);

    useEffect(() => {
        personalApi.fetchAllRoles().then(r => {
            const flatRoles = r.data;
            const arbo = {};
            for(const flatRole of flatRoles) {
                const moduleMatch = flatRole.match(/ROLE_MODULE_(\w+)/);
                if(moduleMatch) {
                    if(!(moduleMatch[1] in arbo))
                        arbo[moduleMatch[1]] = {};
                } else {
                    const featureRegex = /ROLE_(\w+)_(.*?)_(CREATE|EDIT|ACCESS|DELETE|ASSIGN)/;
                    const matches = flatRole.match(featureRegex);
    
                    try {
                        if(!(matches[2] in arbo[matches[1]]))
                            arbo[matches[1]][matches[2]] = {};
                    } catch {
                        //SPECIFIC ROLES
                    }
    
                    console.log(values);
                    try {
                        arbo[matches[1]][matches[2]][matches[3]] = values.roles.includes(flatRole);
                    } catch {
                        console.log(values);
                    }
                    
                }            
            }
            setRoleForms(arbo);

        }).catch(e => console.log(e));
    }, [profile, values.roles])

    const onRoleChange = (value: boolean, role: string) => {
        setValues({
            ...values,
            roles: value ? [...values.roles, role] : values.roles.filter(r => r !== role)
        })

        const splittedRole = role.split('_');
        setRoleForms({
            ...roleForms,
            [splittedRole[1]]: {
                ...roleForms[splittedRole[1]],
                [splittedRole[2]]: {
                    ...roleForms[splittedRole[1]][splittedRole[2]],
                    [splittedRole[3]]: value
                }
            }
        })
    }   

    const setRolesFromModel = async (roleProfile: RoleProfile) => {
        if(roleProfile.id == '0') {
            setValues({
                ...values,
                roles: []
            });
        } else {
            const roles = (await personalApi.fetchRoleProfileRoles(roleProfile)).data;
            setValues({
                ...values,
                roles
            });
        }
        
        setFromModelPopupOpen(false)
    }

    const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            name: e.target.value
        })
    }

    const onSubmit = () => {
        personalApi.createEditRoleProfile(values).then(() => {
            onSuccess();
        })
    }

    return (
        <Form submitText={t('roleProfile.submit')} onSubmit={onSubmit} canSubmit={values.name.length > 0}>  
            <CatchableField label={t('roleProfile.name')}>
                <input className="field" type="text" name='lastName' value={values.name} onChange={onNameChange} />
            </CatchableField>
            <button type="button" onClick={() => setFromModelPopupOpen(true)}>{t('roleProfile.fromModel')}</button>
            <Dialog title={t('roleProfile.fromModel')} isModal={false} isOpen={fromModelPopupOpen} setIsOpen={setFromModelPopupOpen}>
                <RoleSelector onChange={setRolesFromModel} value={{name: 'Test', id: '0', roles: []}} />
            </Dialog>
            <RoleOrganizer data={roleForms} onChange={onRoleChange} />
        </Form>
    )
}

export default RoleProfileForm