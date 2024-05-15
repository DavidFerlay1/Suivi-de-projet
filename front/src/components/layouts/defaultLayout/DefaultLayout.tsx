import './defaultLayout.scss';
import React from 'react';

const DefaultLayout = ({children}) => {
    return (
        <div className="defaultLayout">
            {children}
        </div>
    )
}

export default DefaultLayout;