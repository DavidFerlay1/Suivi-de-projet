import React, { ReactNode, createContext, useContext, useMemo } from "react";
import { PaginationContext } from "./PaginationContext";
import { SortContext } from "./SortContext";
import { SearchContext } from "./SearchContext";
import { FiltersContext } from "./FiltersContext";
import {QueryParams} from '../interfaces/QueryParams';

type QueryContextProviderProps = {
    children: ReactNode|ReactNode[],
    apiFetchCallback: Function
}

type QueryContextValue = {
    fetch: Function,
    params: QueryParams
}

const QueryContext = createContext<QueryContextValue|undefined>(undefined);

const QueryContextProvider = ({children, apiFetchCallback}: QueryContextProviderProps) => {

    const paginationContext = useContext(PaginationContext);
    const sortingContext = useContext(SortContext);
    const searchContext = useContext(SearchContext);
    const filtersContext = useContext(FiltersContext);

    const params = useMemo(() => {
        return {page: paginationContext!.page, sortSettings: sortingContext!.current, search: searchContext.current, filters: filtersContext.current};
    }, [paginationContext?.page, sortingContext?.current, searchContext!.current, filtersContext.current])

    const fetch = async () => {
        const {lastPage, data} = (await apiFetchCallback(params)).data;
        paginationContext?.updateMax(lastPage);
        return data;
    }

    return (
        <QueryContext.Provider value={{fetch, params}}>
            {children}
        </QueryContext.Provider>
    )
}

export {QueryContext, QueryContextProvider}