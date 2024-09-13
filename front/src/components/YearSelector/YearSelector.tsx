import React, { useMemo } from "react";
import Select from 'react-select';

type YearSelectorProps = {
    value: number,
    onChange: Function
}

const today = new Date();

const YearSelector = ({value, onChange}: YearSelectorProps) => {

    const years =  Array.from({length:today.getFullYear() - 1950},(v,k)=>({label: k+1951, value: k+1951}))

    const currentValue = useMemo(() => {
        return years.find(y => y.value === value)
    }, [value, years])

    return (
        <Select options={years} onChange={option => onChange(option?.value)} value={currentValue} />
    )
}

export default YearSelector;