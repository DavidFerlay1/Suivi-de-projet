import React, { useMemo, useRef } from "react";
import './progressBar.scss';

type ProgressBarProps = {
    type: 'percentage' | 'absolute',
    max: number,
    value: number,
    label?: string,
    style?: object
} 

const ProgressBar = ({label, type, max, value, style}: ProgressBarProps) => {

    const progressBarRef = useRef<HTMLDivElement>(null);

    const percentage = useMemo(() => {
        return parseFloat((value / max * 100).toFixed(2));
    }, [value, max])

    const progressColor = useMemo(() => {
        if(percentage === 100)
            return 'var(--success)';
        if(percentage > 50)
            return 'var(--warning)';
        if(percentage > 25)
            return 'var(--alert)';
        return 'var(--danger)';
    }, [percentage])

    return (
        <div className="progress-bar-wrapper" style={style}>
            <div className="informations">
                <label>{label}</label>
                <span>{type === 'percentage' ? `${percentage}%` : `${value} / ${max}`}</span>
            </div>
            <div className="progress-bar" ref={progressBarRef}>
                <div className="fill" style={{width: `${percentage}%`, backgroundColor: progressColor}}></div>
            </div>
        </div>
        
    )
}

export default ProgressBar;