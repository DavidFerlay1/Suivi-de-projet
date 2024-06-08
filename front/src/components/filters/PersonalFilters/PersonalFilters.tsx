import React, { useContext, useEffect, useMemo, useState } from "react"
import RoleSelector from "../../../modules/personal/pages/RoleMonitoring/components/RoleSelector/RoleSelector"
import { RoleProfile } from "../../../interfaces/Personal"
import { FiltersContext } from "../../../contexts/FiltersContext"
import Select, { MultiValue } from 'react-select';
import Dialog from '../../dialogs/dialog/Dialog'
import { useTranslation } from "react-i18next";
import Form from "../../Form/Form";
import { LuCross, LuFilter, LuX } from "react-icons/lu";
import './personalFilters.scss';
import DefaultFilters from "../DefaultFilters/DefaultFilters";

type PersonalFiltersType = {
    fb_roleProfiles: RoleProfile[],
    fb_state: MultiValue<any>
}

const initialState: PersonalFiltersType = {
    fb_roleProfiles: [],
    fb_state: []
}

const PersonalFilters = () => {

    const {t} = useTranslation();

    const [filters, setFilters] = useState<PersonalFiltersType>(initialState)

    const filtersContext = useContext(FiltersContext);
    const [isOpen, setIsOpen] = useState(false);

    const stateOptions = [
        {value: 'account', label: t('misc.withAccount')},
        {value: 'profile', label:  t('misc.withoutAccount')}
    ]

    const reset = () => {
        setFilters(initialState);
    }

    const onSubmit = () => {
        filtersContext.update({
            ...filters,
            fb_roleProfiles: filters.fb_roleProfiles.map(r => r.id),
            fb_state: filters.fb_state.map(v => v.value)
        });
        setIsOpen(false);
    }

    return (
        <DefaultFilters isOpen={isOpen} setIsOpen={setIsOpen}>
            <Form onSubmit={onSubmit} submitText={t('filters.apply')}>
                <button type="button" onClick={reset} style={{alignSelf: 'flex-end'}}>{t('filters.reset')}</button>
                <br/>
                <label>{t('personal.roles')}</label>
                <RoleSelector value={filters.fb_roleProfiles} onChange={(fb_roleProfiles: RoleProfile[]) => setFilters({...filters, fb_roleProfiles})} />
                <label>{t('personal.state')}</label>
                <Select value={filters.fb_state} isMulti={true} options={stateOptions} onChange={selected => setFilters({...filters, fb_state: selected})} />
            </Form>
        </DefaultFilters>
       
    )
}

export default PersonalFilters