import { jwtDecode } from "jwt-decode";
import useApi from "./useApi"
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

export type AuthTokens = {
    token: string,
    refresh_token: string
}

type AuthProviderProps = {
    children: ReactNode
}

type AuthContextType = {
    authenticated: boolean;
    getPayload: () => any;
    isAuthenticated: () => Promise<boolean>;
    storeTokens: (tokens: AuthTokens) => void;
    revokeTokens: () => void;
};

const AuthContext = createContext<AuthContextType>({
    authenticated: false,
    getPayload: () => null,
    isAuthenticated: async () => false,
    storeTokens: (tokens: AuthTokens) => {},
    revokeTokens: () => {} 
});

export const AuthProvider = ({children}: AuthProviderProps) => {

    const {authApi} = useApi();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        isAuthenticated().then(res => {
            setAuthenticated(res);
        })
    }, [])

    const isAuthenticated = async () => {
        let jwt = getJwt();
        if(!jwt) 
            return false;
    
        const decoded = jwtDecode(jwt);

        if(decoded.exp! < (new Date()).getMilliseconds()) {
            try {
                refreshToken();
            } catch {
                return false;
            }
        }
    
        return true;
    }
    
    const refreshToken = async () => {
        const token = localStorage.getItem('refresh_token');
        if(!token)
            return false;
        try {
            const tokens = (await authApi.refreshToken(token)).data;
            storeTokens(tokens);
            return true;
        } catch (err) {
            revokeTokens();
            return false;
        }
    }
    
    const getJwt = () => {
        return localStorage.getItem('token');
    }
    
    const getPayload = () => {
        const jwt = getJwt();
        if(!jwt)
            return null;
        return (jwtDecode(jwt)) as any;
    }
    
    const storeTokens = (tokens: AuthTokens) => {
        localStorage.setItem('token', tokens.token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        setAuthenticated(true);
    }
    
    const revokeTokens = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{getPayload, isAuthenticated, storeTokens, revokeTokens, authenticated}}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
}

export default useAuth;
