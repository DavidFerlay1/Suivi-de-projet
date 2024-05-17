import React, { ReactNode, createContext, useState } from "react";
import {SortSetting} from '../interfaces/Api/SortSetting';

type SortContextProviderProps = {
    children: ReactNode|ReactNode[],
    defaultSetting: SortSetting,
}

type SortContextValue = {
    current: SortSetting,
    update: Function
}

const SortContext = createContext<SortContextValue|undefined>(undefined);

const SortContextProvider = ({children, defaultSetting}: SortContextProviderProps) => {

    const [current, setCurrent] = useState<SortSetting>(defaultSetting);

    const update = (setting: SortSetting) => {
        setCurrent(setting);
    }

    return (
        <SortContext.Provider value={{current, update}}>
            {children}
        </SortContext.Provider>
    )
}

export {SortContext, SortContextProvider}