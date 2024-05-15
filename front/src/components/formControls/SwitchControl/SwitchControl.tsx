import React, { ChangeEventHandler, ElementRef, useCallback, useEffect, useRef, useState } from "react"
import "./switchControl.scss"

type SwitchControlProps = {
    value?: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    name?: string
    disabled?: boolean
}

const SwitchControl = ({value, onChange, name, disabled}: SwitchControlProps) => {

    const checkboxRef = useRef<HTMLInputElement>(null);

    const onClick = useCallback(() => {
        if(checkboxRef.current && !disabled)
            checkboxRef.current.click();
    }, [checkboxRef])

    return (
        <div className={`switch${value ? ' checked' : ''}${disabled ? ' disabled' : ''}`} onClick={onClick}>
            <input disabled={disabled} ref={checkboxRef} type="checkbox" checked={value} onChange={onChange} name={name} className="switch-checkbox" />
            <span className="ball"/>
        </div>
    )
}

export default SwitchControl;