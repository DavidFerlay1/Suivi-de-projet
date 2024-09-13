import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";

type MonthSelectorProps = {
    value: number,
    onChange: Function
}

const MonthSelector = ({value, onChange}: MonthSelectorProps) => {

    const {t} = useTranslation();

    const [MONTH_VALUES] = useState([
        {value: 0, label: t('date.january')},
        {value: 1, label: t('date.february')},
        {value: 2, label: t('date.march')},
        {value: 3, label: t('date.april')},
        {value: 4, label: t('date.may')},
        {value: 5, label: t('date.june')},
        {value: 6, label: t('date.july')},
        {value: 7, label: t('date.august')},
        {value: 8, label: t('date.september')},
        {value: 9, label: t('date.october')},
        {value: 10, label: t('date.november')},
        {value: 11, label: t('date.december')},
    ])

    const currentValue = useMemo(() => {
        return MONTH_VALUES.find(month => month.value === value);
        
    }, [value, MONTH_VALUES])

    return (
        <Select options={MONTH_VALUES} value={currentValue} onChange={option => onChange(option?.value)} />
    )
}

export default MonthSelector;