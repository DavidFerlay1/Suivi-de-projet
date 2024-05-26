import React, { ReactNode } from "react"
import { PaginationContextProvider } from "../../../contexts/PaginationContext"
import { QueryContextProvider } from "../../../contexts/QueryContext"
import { SortContextProvider } from "../../../contexts/SortContext"
import { SortSetting } from "../../../interfaces/Api/SortSetting";
import { SearchContextProvider } from "../../../contexts/SearchContext";
import { FiltersContextProvider } from "../../../contexts/FiltersContext";

export type QueryFunction = (page: number, sortSetting: SortSetting, search: string, filters: object) => Promise<any>;

type QueryContextLayoutProps = {
    children: ReactNode|ReactNode[],
    apiFetchCallback: QueryFunction,
    defaultSortSetting: SortSetting
}

const QueryContextLayout = ({children, defaultSortSetting, apiFetchCallback}: QueryContextLayoutProps) => {
    return (
        <PaginationContextProvider>
            <SortContextProvider defaultSetting={defaultSortSetting}>
                <SearchContextProvider>
                    <FiltersContextProvider>
                        <QueryContextProvider apiFetchCallback={apiFetchCallback}>
                            {children}
                        </QueryContextProvider>
                    </FiltersContextProvider>
                </SearchContextProvider> 
            </SortContextProvider>
        </PaginationContextProvider>
    )
}

export default QueryContextLayout;