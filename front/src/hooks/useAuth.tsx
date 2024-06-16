import { jwtDecode } from "jwt-decode";
import useApi from "./useApi"

export type AuthTokens = {
    token: string,
    refresh_token: string
}

const useAuth = () => {

    const {authApi} = useApi();

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
            console.log(err)
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
    }
    
    const revokeTokens = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
    }

    return {getPayload, isAuthenticated, storeTokens, revokeTokens}
}

export default useAuth;
