import React, { ReactNode, createContext, useState } from "react";

type SearchContextValue = {
    current: string,
    update: Function
}

type SearchContextProviderProps = {
    children: ReactNode|ReactNode[],
}

const SearchContext = createContext<SearchContextValue>({current: '', update: () => {}});

const SearchContextProvider = ({children}: SearchContextProviderProps) => {

    const [current, setCurrent] = useState('');

    const update = (newVal: string) => {
        setCurrent(newVal);
    }

    return (
        <SearchContext.Provider value={{current, update}}>
            {children} 
        </SearchContext.Provider>
    )
}

export {SearchContext, SearchContextProvider};