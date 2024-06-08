import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import DefaultFilters from "../DefaultFilters/DefaultFilters";
import Form, { CatchableField } from "../../Form/Form";
import PersonalSelector from "../../PersonalSelector/PersonalSelector";
import { FiltersContext } from "../../../contexts/FiltersContext";
import { SubmittablePersonal } from "../../../interfaces/Personal";
import Select from 'react-select';

type RoleProfileFiltersType = {
    fb_assignedAccounts: SubmittablePersonal[],
    fb_immutable: number[]
}

const initialState: RoleProfileFiltersType = {
    fb_assignedAccounts: [],
    fb_immutable: []
}

const RoleProfileFilters = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {t} = useTranslation();

    const [filters, setFilters] = useState<RoleProfileFiltersType>(initialState);
    const filtersContext = useContext(FiltersContext);

    const immutableOptions = [
        {value: 1, label: t('roleProfile.isImmutable')},
        {value: 0, label:  t('roleProfile.isntImmutable')}
    ]

    const reset = () => {
        setFilters(initialState);
    }

    const onSubmit = () => {
        filtersContext.update({
            ...filters,
            fb_assignedAccounts: filters.fb_assignedAccounts.map(a => a.id)
        });
        setIsOpen(false);
    }

    const onPersonalChange = (value: SubmittablePersonal[]) => {
        setFilters({
            ...filters,
            fb_assignedAccounts: value
        })
    }

    const onImmutableChange = (value) => {
        setFilters({
            ...filters,
            fb_immutable: value.map(v => v.value)
        })
    }

    return (
        <DefaultFilters isOpen={isOpen} setIsOpen={setIsOpen}>
            <Form onSubmit={onSubmit}>
                <CatchableField label={t('roleProfile.filters.byAssign')}>
                    <PersonalSelector onChange={onPersonalChange} value={filters.fb_assignedAccounts} />
                </CatchableField>
                <label>{t('roleProfile.type')}</label>
                <Select isMulti={true} value={filters.fb_immutable.map(f => immutableOptions.find(o => o.value === f))} options={immutableOptions} onChange={onImmutableChange} />
                <button type="button" onClick={reset} style={{alignSelf: 'flex-end'}}>{t('filters.reset')}</button>
            </Form>
        </DefaultFilters>
    )
}

export default RoleProfileFilters;