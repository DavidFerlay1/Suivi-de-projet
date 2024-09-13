import React, { MouseEvent, useMemo } from "react"
import { CalendarEvent } from "@interfaces/CalendarEvent"

type CalendarEventItemProps = {
    event: CalendarEvent,
    onClick: Function,
    className?: '',
    parentHeight: number|undefined
}

const CalendarEventItem = ({event, onClick, className, parentHeight}: CalendarEventItemProps) => {

    const proportions = useMemo(() => {
        if(!parentHeight)
            return {top: 0, height: 0};

        const max = 1440;
        const beginDate = new Date(event.beginDateMillis);
        const endDate = new Date(event.endDateMillis);

        const top = parentHeight * (beginDate.getHours() * 60 + beginDate.getMinutes()) / max;
        const bottom = parentHeight * (endDate.getHours() * 60 + endDate.getMinutes()) / max;

        return {
            top,
            height: bottom - top
        }

    }, [parentHeight])
    
    const onItemClick = (e: MouseEvent) => {
        e.stopPropagation();
        onClick(event);
    }

    return (
        <div style={{top: proportions.top, height: proportions.height}} className={`calendarEventItem ${className ? className : ''}`} onClick={onItemClick}>{event.title}</div>
    )
}   

export default CalendarEventItem;