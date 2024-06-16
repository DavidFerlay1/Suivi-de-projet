import React, { ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router";
import useAuth from "@hooks/useAuth";

type AnonymousOnlyLayoutProps = {
    children: ReactNode|ReactNode[]
}

const AnonymousOnlyLayout = ({children}: AnonymousOnlyLayoutProps) => {
    const [canAccess, setCanAccess] = useState(false);
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const controlAccess = async () => {
            if(await isAuthenticated())
                navigate('/project');
            else
                setCanAccess(true);
        }

        controlAccess();
    }, [])

    return canAccess ? <>{children}</> : null
}

export default AnonymousOnlyLayout;