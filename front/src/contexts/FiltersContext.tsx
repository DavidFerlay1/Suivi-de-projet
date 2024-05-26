import React, { createContext, useContext, useEffect, useState } from "react";
import { PaginationContext } from "./PaginationContext";

type FiltersContextValue = {
    current: object,
    update: Function
}



const FiltersContext = createContext<FiltersContextValue>({
    current: {},
    update: () => {}
});

const FiltersContextProvider = ({children}) => {

    const [state, setState] = useState({});

    const paginationContext = useContext(PaginationContext);

    const update = (value: object) => {
        const newValue = {};
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