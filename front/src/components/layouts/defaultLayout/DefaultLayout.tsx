import './defaultLayout.scss';
import React, { ReactNode } from 'react';

type DefaultLayoutProps = {
    children: ReactNode
}

const DefaultLayout = ({children}: DefaultLayoutProps) => {
    return (
        <div className="defaultLayout">
            {children}
        </div>
    )
}

export default DefaultLayout;