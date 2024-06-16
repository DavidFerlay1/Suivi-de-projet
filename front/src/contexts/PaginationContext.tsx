import React, { ReactNode, createContext, useMemo, useState } from "react"

type PaginationContextValue = {
    page: number,
    maxPage: number,
    status: 'processing' | 'available' | 'fullloaded',
    update: Function,
    updateMax: Function
}

type PaginationContextProviderProps = {
    children: ReactNode[]|ReactNode,
}

type PaginationSettings = {
    page: number,
    lastPage: number
}

const PaginationContext = createContext<PaginationContextValue|undefined>(undefined);

const PaginationContextProvider = ({children}: PaginationContextProviderProps) => {

    const [state, setState] = useState<PaginationSettings>({page: 1, lastPage: 1});

    const sanitizePageNumber = (page: number) => {
        if(page < 1)
            return 1;

        return page < state.lastPage ? page : state.lastPage;
    }

    const update = (page: number) => {
        setState({...state, page: sanitizePageNumber(page)});
    }

    const updateMax = (page: number) => {
        setState({...state, lastPage: page || 1});
    }

    const status = useMemo(() => {
        if(state.page >= state.lastPage)
            return 'fullloaded';
        return 'available';
    }, [state])

    return (
        <PaginationContext.Provider value={{page: state.page, status, update, updateMax, maxPage: state.lastPage}}>
            {children}
        </PaginationContext.Provider>
    )
}

export {PaginationContext, PaginationContextProvider};

