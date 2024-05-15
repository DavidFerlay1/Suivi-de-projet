import React, { ReactNode } from "react"
import AuthenticatedLayout from "./AuthenticatedLayout"
import AuthorizedLayout from "./AuthorizedLayout"

type AccessControlledLayoutProps = {
    children: ReactNode|ReactNode[],
    roles: string[]
}

const AccessControlledLayout = ({children, roles}: AccessControlledLayoutProps) => {
    return (
        <AuthenticatedLayout>
            <AuthorizedLayout roles={roles}>
                {children}
            </AuthorizedLayout>
        </AuthenticatedLayout>
    )
}

export default AccessControlledLayout;