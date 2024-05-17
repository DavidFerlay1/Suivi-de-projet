import React, { ReactNode } from "react"
import { PaginationContextProvider } from "../../../contexts/PaginationContext"
import { QueryContextProvider } from "../../../contexts/QueryContext"
import { SortContextProvider } from "../../../contexts/SortContext"
import { SortSetting } from "../../../interfaces/Api/SortSetting";

export type QueryFunction = (page: number, sortSetting: SortSetting) => Promise<any>;

type QueryContextLayoutProps = {
    children: ReactNode|ReactNode[],
    apiFetchCallback: QueryFunction,
    defaultSortSetting: SortSetting
}

const QueryContextLayout = ({children, defaultSortSetting, apiFetchCallback}: QueryContextLayoutProps) => {
    return (
        <PaginationContextProvider>
            <SortContextProvider defaultSetting={defaultSortSetting}>
                <QueryContextProvider apiFetchCallback={apiFetchCallback}>
                    {children}
                </QueryContextProvider>
            </SortContextProvider>
        </PaginationContextProvider>
    )
}

export default QueryContextLayout;