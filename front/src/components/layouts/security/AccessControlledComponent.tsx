import React, { ReactNode } from "react";
import usePermissions from '@hooks/usePermissions';

type AccessControlledComponentProps = {
    children: ReactNode|ReactNode[],
    roles: string[]
}

const AccessControlledComponent = ({children, roles}: AccessControlledComponentProps) => {
    const {hasPermissions} = usePermissions();

    return hasPermissions(roles) ? <>{children}</> : null
}

export default AccessControlledComponent;