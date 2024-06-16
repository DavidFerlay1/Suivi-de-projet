import React, { ReactNode, useEffect, useState } from "react"
import useApi from "@hooks/useApi"
import { useNavigate } from "react-router"

type AuthorizedLayoutProps = {
    roles: string[],
    children: ReactNode|ReactNode[]
}

const AuthorizedLayout = ({roles, children}: AuthorizedLayoutProps) => {

    const {authApi} = useApi();
    const [access, setAccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        authApi.controlAccess(roles).then(res => {
            try {
                if(res.data === 'granted')
                    setAccess(true);
                else
                    navigate("/");
            } catch (e) {
                navigate('/auth');
            }
            
        }).catch(() => navigate('/'))
    }, [])

    return access ? <>{children}</> : null
}

export default AuthorizedLayout;