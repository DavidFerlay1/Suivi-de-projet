import React, { createContext } from "react";

const FiltersContext = createContext({});

const FiltersContextProvider = ({children}) => {
    return (
        <FiltersContext.Provider value={{}}>
            {children}
        </FiltersContext.Provider>
    )
}