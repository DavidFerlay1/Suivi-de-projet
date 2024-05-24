import React, { ReactNode, createContext, useContext } from "react";
import { PaginationContext } from "./PaginationContext";
import { SortContext } from "./SortContext";
import { SortSetting } from "../interfaces/Api/SortSetting";
import { SearchContext } from "./SearchContext";

type QueryContextProviderProps = {
    children: ReactNode|ReactNode[],
    apiFetchCallback: Function
}

type QueryContextValue = {
    fetch: Function,
    page: number,
    sortSettings: SortSetting,
    searchPattern: string
}

const QueryContext = createContext<QueryContextValue|undefined>(undefined);

const QueryContextProvider = ({children, apiFetchCallback}: QueryContextProviderProps) => {

    const paginationContext = useContext(PaginationContext);
    const sortingContext = useContext(SortContext);
    const searchContext = useContext(SearchContext);

    const fetch = async () => {
        const {lastPage, data} = (await apiFetchCallback(paginationContext!.page, sortingContext!.current, searchContext.current)).data;
        paginationContext?.updateMax(lastPage);
        return data;
    }

    return (
        <QueryContext.Provider value={{fetch, page: paginationContext!.page, sortSettings: sortingContext!.current, searchPattern: searchContext.current}}>
            {children}
        </QueryContext.Provider>
    )
}

export {QueryContext, QueryContextProvider}