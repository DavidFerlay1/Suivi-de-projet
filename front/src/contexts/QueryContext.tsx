import React, { ReactNode, createContext, useContext } from "react";
import { PaginationContext } from "./PaginationContext";
import { SortContext } from "./SortContext";

type QueryContextProviderProps = {
    children: ReactNode|ReactNode[],
    apiFetchCallback: Function
}

type QueryContextValue = {
    fetch: Function
}

const QueryContext = createContext<QueryContextValue|undefined>(undefined);

const QueryContextProvider = ({children, apiFetchCallback}: QueryContextProviderProps) => {

    const paginationContext = useContext(PaginationContext);
    const sortingContext = useContext(SortContext);

    const fetch = async () => {
        const {lastPage, data} = (await apiFetchCallback(paginationContext!.page, sortingContext!.current)).data;
        paginationContext?.updateMax(lastPage);
        return data;
    }

    return (
        <QueryContext.Provider value={{fetch}}>
            {children}
        </QueryContext.Provider>
    )
}

export {QueryContext, QueryContextProvider}