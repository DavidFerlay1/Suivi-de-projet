import React, { ReactNode, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@components/dialogs/dialog/Dialog";
import { FiltersContext } from "@contexts/FiltersContext";
import { LuFilter } from "react-icons/lu";

type DefaultFiltersProps = {
    children: ReactNode,
    isOpen: boolean,
    setIsOpen: Function
}

const DefaultFilters = ({children, isOpen, setIsOpen}: DefaultFiltersProps) => {
    const {t} = useTranslation();

    const filtersContext = useContext(FiltersContext);

    const filtersCount = useMemo(() => {
        let total = 0;

        for(const key of Object.keys(filtersContext.current)) {
            if(typeof key === 'string' && filtersContext.current[key])
                total++;
        }

        return total;
    }, [filtersContext.current])

    return (
        <div className="filter-wrapper">
            {filtersCount > 0 && <span className="indicator">{filtersCount}</span>}
            <button className="icon-button" onClick={() => setIsOpen(true)}><LuFilter /></button>
            <Dialog isModal={false} isOpen={isOpen} setIsOpen={setIsOpen} title={t('filters.title')}>
                {children}
            </Dialog>
        </div>
    )
}

export default DefaultFilters