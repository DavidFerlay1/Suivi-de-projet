import React, { useContext, useEffect, useState } from "react";
import { SubmittablePersonal } from "../../interfaces/Personal";
import AsyncSelector from 'react-select/async';
import { QueryContext } from "../../contexts/QueryContext";
import useApi from "../../hooks/useApi";

type PersonalSelectorProps = {
    value: SubmittablePersonal|SubmittablePersonal[],
    onChange: Function
}

const PersonalSelector = ({value, onChange}: PersonalSelectorProps) => {
    const [defaultOptions, setDefaultOptions] = useState<SubmittablePersonal[]>([]);

    const {personalApi} = useApi();

    useEffect(() => {
        fetchData('').then((res) => {
            setDefaultOptions(res);
        })
    }, [])

    const fetchData = async (text: string) => {
        const data = (await personalApi.getList(1, {field: 'lastName', sort: 'ASC'}, text, {})).data.data;
        console.log(data);
        return data.map((personal: SubmittablePersonal) => ({
            value: personal.id,
            label: `${personal.lastName.toUpperCase()} ${personal.firstname}`,
            ...personal
        }))
    }

    const loadOptions = (inputValue, callback) => {
        fetchData(inputValue).then(options => callback(options));
    }

    return Array.isArray(value) ? <MultiPersonalSelector loadOptions={loadOptions} value={value} onChange={onChange} defaultOptions={defaultOptions} /> : <SinglePersonalSelector loadOptions={loadOptions} value={value} onChange={onChange} defaultOptions={defaultOptions} />
}

const MultiPersonalSelector = ({value, onChange, defaultOptions, loadOptions}) => {

    const onValuechange = (val) => {
        onChange(val.map(data => data as SubmittablePersonal));
    }

    return (
        <AsyncSelector isMulti={true} loadOptions={loadOptions} defaultOptions={defaultOptions} onChange={onValuechange} value={value} cacheOptions={true} />
    )
}

const SinglePersonalSelector = ({value, onChange, defaultOptions, loadOptions}) => {

    const onValuechange = (val) => {
        onChange(val as SubmittablePersonal);
    }

    return (
        <AsyncSelector isMulti={false} loadOptions={loadOptions} defaultOptions={defaultOptions} onChange={onChange} value={value} cacheOptions={true} />
    )
}

export default PersonalSelector;