import React, { ReactNode } from "react"
import './menuBar.scss'

type MenuBarProps = {
    children: ReactNode|ReactNode[]
}

const MenuBar = ({children}: MenuBarProps) => {
    return (
        <div className="menuBar">
            {children}
        </div>
    )
}

export default MenuBar