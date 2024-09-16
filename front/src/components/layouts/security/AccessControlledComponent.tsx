import React, { ReactNode, useContext } from "react";
import usePermissions from '@hooks/usePermissions';
import { AccessContext } from "@contexts/AccessContext";

type AccessControlledComponentProps = {
    children: ReactNode|ReactNode[],
    roles: string[]
}

const AccessControlledComponent = ({children, roles}: AccessControlledComponentProps) => {
    const accessContext = useContext(AccessContext);

    return accessContext.hasRoles(roles) ? <>{children}</> : null
}

export default AccessControlledComponent;