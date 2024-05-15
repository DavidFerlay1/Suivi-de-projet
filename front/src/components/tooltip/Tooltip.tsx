import React, { useEffect, useRef, useState } from "react"
import { IoMdHelpCircleOutline } from "react-icons/io";
import './tooltip.scss';

const Tooltip = ({children, top}) => {

    const [shown, setShown] = useState(false);

    return (
        <div className="tooltip-wrapper" onMouseEnter={() => setShown(true)} onMouseLeave={() => setShown(false)} >
            <IoMdHelpCircleOutline  className="icon"/>
            {shown && <div className={`tooltip-bubble ${top ? 'top' : ''}`}>{children}</div>}
        </div>
    )
}

export default Tooltip