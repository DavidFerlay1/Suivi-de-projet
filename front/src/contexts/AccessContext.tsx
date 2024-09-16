import useApi from "@hooks/useApi"
import React, { ReactNode, createContext, useCallback, useEffect, useState } from "react"


type AccessContextValue = {
    roles: string[],
    hasRoles: (roles: string[]) => boolean
}

type AccessContextProviderProps = {
    children: ReactNode,
    required: string[]
}

const AccessContext = createContext<AccessContextValue>({
    roles: [],
    hasRoles: ([]) => false
})

const AccessContextProvider = ({children, required}: AccessContextProviderProps) => {
    const [roles, setRoles] = useState([]);
    const {authApi} = useApi();

    const [requiredRoles, setRequiredRoles] = useState<string[]>([]);

    useEffect(() => {

        const cruds = [];
        const suffixes = ['_ACCESS', '_EDIT', '_DELETE', '_CREATE'];

        for(const r of required) {
            if(r.match(/.*_CRUD/)) {
                const prefix = r.split('_CRUD')[0];
                for(const suffix of suffixes)
                    cruds.push(prefix + suffix);
            } else {
                cruds.push(r);
            }
        }
        setRequiredRoles(cruds);
        authApi.requirePermissions(cruds).then(res => setRoles(res.data))
    }, [])

    const hasRoles = useCallback((required: string[]) => {
        const owned = roles.filter(r => required.includes(r));
        return owned.length === required.length;
    }, [roles])

    return (
        <AccessContext.Provider value={{roles, hasRoles}}>
            {children}
        </AccessContext.Provider>
    )
}

export {AccessContext, AccessContextProvider};