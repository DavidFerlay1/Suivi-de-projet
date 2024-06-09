import React, { useContext, useEffect, useState } from "react";
import { SubmittablePersonal } from "../../interfaces/Personal";
import AsyncSelector from 'react-select/async';
import { QueryContext } from "../../contexts/QueryContext";
import useApi from "../../hooks/useApi";

type PersonalSelectorProps = {
    value: SubmittablePersonal|SubmittablePersonal[],
    onChange: Function
    additionalFilters?: any
}

const PersonalSelector = ({value, onChange, additionalFilters = {}}: PersonalSelectorProps) => {
    const [defaultOptions, setDefaultOptions] = useState<SubmittablePersonal[]>([]);

    const {personalApi} = useApi();

    useEffect(() => {
        fetchData('').then((res) => {
            setDefaultOptions(res);
        })
    }, [])

    const fetchData = async (text: string) => {
        const data = (await personalApi.getList(1, {field: 'lastName', sort: 'ASC'}, text, additionalFilters)).data.data;
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

    return Array.isArray(value) ? <MultiPersonalSelector loadOptions={loadOptions} value={value.map(value => ({...value, value: value.id, label: `${value.lastName.toUpperCase()} ${value.firstname}`}))} onChange={onChange} defaultOptions={defaultOptions} /> : <SinglePersonalSelector loadOptions={loadOptions} value={value} onChange={onChange} defaultOptions={defaultOptions} />
}

const MultiPersonalSelector = ({value, onChange, defaultOptions, loadOptions}) => {

    const onValuechange = (val) => {
        onChange(val.map(data => {
            const clone = {...data};
            delete clone.value;
            delete clone.label;
            return clone;
        }));
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