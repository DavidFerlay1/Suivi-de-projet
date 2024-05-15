import React, { ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
type AuthenticatedLayoutProps = {
    children: ReactNode|ReactNode[]
}

const AuthenticatedLayout = ({children}: AuthenticatedLayoutProps) => {
    const [authState, setAuthState] = useState(false);
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const accessControl = async () => {
            try {
                if(await isAuthenticated())
                    setAuthState(true);
                else {
                    navigate("/auth");
                }
            } catch (e) {
                navigate("/auth");
            }
           
        }
        accessControl();
    }, [])

    return authState && <>{children}</>
}

export default AuthenticatedLayout;