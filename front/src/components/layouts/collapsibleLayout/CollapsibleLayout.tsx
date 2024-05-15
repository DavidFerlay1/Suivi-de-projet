import React, { ReactNode, useState } from "react"
import {IoMdAdd, IoMdRemove} from 'react-icons/io';
import './collapsibleLayout.scss';

type CollapsibleLayoutProps = {
    title: string,
    children: ReactNode[]|ReactNode,
    className?: string
}

const CollapsibleLayout = ({title, children, className}: CollapsibleLayoutProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`collapsible-wrapper ${className ?? ''}`}>
            <button className='collapse-toggle' onClick={() => setOpen(!open)}>{title} {open ? <IoMdRemove/> : <IoMdAdd />}</button>
            <div className={`collapsible-content ${open ? '' : 'collapsed'}`}>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default CollapsibleLayout;