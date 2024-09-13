import React, { ChangeEvent, useEffect, useMemo, useState } from "react"
import './dateMillisPicker.scss'
import HoursMillisPicker from "../HoursMillisPicker/HoursMillisPicker";

type DateMillisPickerProps = {
    dateMillis: number,
    onChange: Function
}

const DateMillisPicker = ({dateMillis, onChange}: DateMillisPickerProps) => {

    const initialDate = new Date(dateMillis);

    const [date, setDate] = useState(initialDate);
    const [hours, setHours] = useState(initialDate.getHours() * 3600000 + initialDate.getMinutes() * 60000);

    useEffect(() => {
        console.log(date)
    }, [date])

    const onHoursChange = (hours: number) => {
        setHours(hours);
    }

    const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDate(new Date(e.target.value));
    }

    useEffect(() => {
        onChange(date.getTime() + hours);
    }, [date, hours])

    return (
        <div className="dateMillisPicker">
            <input value={date.toLocaleDateString('en-CA')} onChange={onDateChange} className="field" type="date" />
            <HoursMillisPicker onChange={onHoursChange} hoursMillis={hours} />
        </div>
        
    )
}

export default DateMillisPicker;