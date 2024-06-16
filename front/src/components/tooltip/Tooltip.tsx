import React, { useState } from "react"
import { IoMdHelpCircleOutline } from "react-icons/io";
import './tooltip.scss';

type TooltipProps = {
    children: any,
    top?: boolean,
    icon?: any
}

const Tooltip = ({children, top = false, icon}: TooltipProps) => {

    const [shown, setShown] = useState(false);

    return (
        <div className="tooltip-wrapper" onMouseEnter={() => setShown(true)} onMouseLeave={() => setShown(false)} >
            {icon ? icon : <IoMdHelpCircleOutline className="icon"/> }
            {shown && <div className={`tooltip-bubble ${top ? 'top' : ''}`}>{children}</div>}
        </div>
    )
}

export default Tooltip