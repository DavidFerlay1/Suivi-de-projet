import React, { useContext, useEffect, useState } from "react"
import { RoleProfile } from "../../../../../../interfaces/Personal";
import AsyncSelect from 'react-select/async';
import useApi from "../../../../../../hooks/useApi";
import { MultiValue } from "react-select";


const RoleSelector = ({value, onChange}) => {
    const [defaultOptions, setDefaultOptions] = useState<boolean|[]>(false);

    const {personalApi} = useApi();

    useEffect(() => {
        loadOptions('').then(result => setDefaultOptions(result));
    }, [])

    const onValuechange = (value: MultiValue<{label: string, value: string}>) => {
        onChange(value.map(val => ({id: val.value, name: val.label})))
    }

    const loadOptions = async (text: string) => {
        const roleProfiles = (await personalApi.getRoleProfileSuggestions(1, {field: 'name', sort: 'ASC'}, text)).data.data
        return roleProfiles.map((roleProfile: RoleProfile) => ({label: roleProfile.name, value: roleProfile.id}));
    }

    return defaultOptions !== false && (
        <AsyncSelect isMulti={true} onChange={onValuechange} value={value.map(v => ({value: v.id, label: v.name}))} loadOptions={loadOptions} cacheOptions={true} defaultOptions={defaultOptions} />
    )
}

export default RoleSelector;