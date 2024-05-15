import React, { useEffect, useState } from "react"
import useApi from "../../../../../hooks/useApi";
import { RoleProfile } from "../../../../../interfaces/Personal";
import RoleOrganizer from "./RoleOrganizer";

type RoleProfileFormProps = {
    profile?: RoleProfile
}

const RoleProfileForm = ({profile}: RoleProfileFormProps) => {

    const {personalApi} = useApi();
    const [values, setValues] = useState<RoleProfile>(profile || {
        name: '',
        roles: []
    })
    const [roleForms, setRoleForms] = useState<any>({});

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
                    const featureRegex = /ROLE_(\w+)_(.*?)_(EDIT|ACCESS|DELETE)/;
                    const matches = flatRole.match(featureRegex);
    
                    if(!(matches[2] in arbo[matches[1]]))
                        arbo[matches[1]][matches[2]] = {};
    
                    arbo[matches[1]][matches[2]][matches[3]] = flatRole in values.roles;
                }            
            }
            setRoleForms(arbo);

        }).catch(e => console.log(e));
    }, [])

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

    return (
        <div>
            <RoleOrganizer data={roleForms} onChange={onRoleChange} />
        </div>
    )
}

export default RoleProfileForm