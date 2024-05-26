import React, { useContext, useEffect, useMemo, useState } from "react"
import RoleSelector from "../../modules/personal/pages/RoleMonitoring/components/RoleSelector/RoleSelector"
import { RoleProfile } from "../../interfaces/Personal"
import { FiltersContext } from "../../contexts/FiltersContext"
import Select, { MultiValue } from 'react-select';
import Dialog from '../../components/dialogs/dialog/Dialog'
import { useTranslation } from "react-i18next";
import Form from "../Form/Form";
import { LuCross, LuFilter } from "react-icons/lu";

type PersonalFiltersType = {
    fb_roleProfiles: RoleProfile[],
    fb_state: MultiValue<any>
}

const initialState: PersonalFiltersType = {
    fb_roleProfiles: [],
    fb_state: []
}

const PersonalFilters = () => {

    const [isOpen, setIsOpen] = useState(false);
    const {t} = useTranslation();

    const [filters, setFilters] = useState<PersonalFiltersType>(initialState)

    const filtersContext = useContext(FiltersContext);

    const stateOptions = [
        {value: 'account', label: t('misc.withAccount')},
        {value: 'profile', label:  t('misc.withoutAccount')}
    ]

    const reset = () => {
        filtersContext.update(initialState);
        setFilters(initialState);
    }

    const filtersCount = useMemo(() => {
        let total = 0;

        for(const key of Object.keys(filtersContext.current)) {
            if(filtersContext.current[key])
                total++;
        }

        return total;
    }, [filtersContext.current])

    const onSubmit = () => {
        filtersContext.update({
            ...filters,
            fb_roleProfiles: filters.fb_roleProfiles.map(r => r.id),
            fb_state: filters.fb_state.map(v => v.value)
        });
        setIsOpen(false);
    }

    return (
        <>
            {filtersCount > 0 && <span>{filtersCount}</span>}
            <button className="icon-button" onClick={() => setIsOpen(true)}><LuFilter /></button>
            <button className="icon-button danger" onClick={reset}><LuCross /></button>
            <Dialog isModal={false} isOpen={isOpen} setIsOpen={setIsOpen} title={t('filters.title')}>
                <Form onSubmit={onSubmit} submitText={t('filters.apply')}>
                    <RoleSelector value={filters.fb_roleProfiles} onChange={(fb_roleProfiles: RoleProfile[]) => setFilters({...filters, fb_roleProfiles})} />
                    <Select value={filters.fb_state} isMulti={true} options={stateOptions} onChange={selected => setFilters({...filters, fb_state: selected})} />
                </Form>
            </Dialog>
        </>
    )
}

export default PersonalFilters