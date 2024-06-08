import React, { useContext, useEffect, useState } from "react"
import { RoleProfile } from "../../../../../../interfaces/Personal";
import AsyncSelect from 'react-select/async';
import useApi from "../../../../../../hooks/useApi";
import { MultiValue } from "react-select";
import { useTranslation } from "react-i18next";

type RoleSelectorProps = {
    value: RoleProfile|RoleProfile[],
    multi?: boolean,
    onChange: Function
}

const RoleSelector = ({value, onChange}: RoleSelectorProps) => {

    const [defaultOptions, setDefaultOptions] = useState<boolean|[]>(false);
    const {personalApi} = useApi();
    const {t} = useTranslation();

    useEffect(() => {
        loadOptions('').then(result => setDefaultOptions(Array.isArray(value) ? result : [{label: t('misc.reinit'), value: 0}, ...result]));
    }, [])

    const loadOptions = async (text: string) => {
        const roleProfiles = (await personalApi.getRoleProfileSuggestions(1, {field: 'name', sort: 'ASC'}, text, {})).data.data
        return roleProfiles.map((roleProfile: RoleProfile) => ({label: roleProfile.name, value: roleProfile.id}));
    }

    return Array.isArray(value) ? <MultiRoleSelector value={value} onChange={onChange} loadOptions={loadOptions} defaultOptions={defaultOptions} /> : <SingleRoleSelector loadOptions={loadOptions} value={value} onChange={onChange} defaultOptions={defaultOptions} />
}

const MultiRoleSelector = ({value, onChange, loadOptions, defaultOptions}) => {
    const onValuechange = (value: MultiValue<{label: string, value: string}>) => {
        onChange(value.map(val => ({id: val.value, name: val.label})))
    }

    return defaultOptions !== false && (
        <AsyncSelect isMulti={true} onChange={onValuechange} value={value.map(v => ({value: v.id, label: v.name}))} loadOptions={loadOptions} cacheOptions={true} defaultOptions={defaultOptions} />
    )
}

const SingleRoleSelector = ({value, onChange, loadOptions, defaultOptions}) => {

    const onValuechange = (val) => {
        onChange({name: val.label, id: val.value})
    }

    return (
        <AsyncSelect isMulti={false} onChange={onValuechange} value={value} loadOptions={loadOptions} cacheOptions={true} defaultOptions={defaultOptions} />
    )
}

export default RoleSelector;