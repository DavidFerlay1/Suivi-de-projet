import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { PaginationContext } from "./PaginationContext";

type FiltersContextValue = {
    current: any,
    update: Function
}

type FiltersContextProviderProps = {
    children: ReactNode
}

const FiltersContext = createContext<FiltersContextValue>({
    current: {},
    update: () => {}
});

const FiltersContextProvider = ({children}: FiltersContextProviderProps) => {

    const [state, setState] = useState({});

    const paginationContext = useContext(PaginationContext);

    const update = (value: any) => {
        const newValue = {} as any;
        for(const filter of Object.keys(value)) {
            if(value[filter].length)
                newValue[filter] = value[filter].join(";");
        }

        setState(newValue);
    }

    useEffect(() => {
        paginationContext?.update(1);
    }, [state])

    return (
        <FiltersContext.Provider value={{current: state, update}}>
            {children}
        </FiltersContext.Provider>
    )
}

export {FiltersContext, FiltersContextProvider}