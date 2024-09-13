import React, { useEffect, useState } from "react"
import './hoursMillisPicker.scss';
import Select from "react-select";

type HoursMillisPickerProps = {
    hoursMillis: number,
    onChange: Function
}

const HoursMillisPicker = ({hoursMillis, onChange}: HoursMillisPickerProps) => {

    const [minutes, setMinutes] = useState(Math.floor(hoursMillis % 3600000) / 60000);
    const [hours, setHours] = useState(Math.floor(hoursMillis / 3600000));

    const [hourSelect] = useState(Array.from({length: 24}, (_, v) => (
        {label: (v < 10 ? `0${v}` ! : v), value: v}
    )));

    const [minuteSelect] = useState([0, 15, 30, 45].map(val => ({label: val, value: val})))

    useEffect(() => {
        onChange(minutes * 60000 + hours * 3600000);
    }, [minutes, hours])

    return (
        <div className="hoursMillisPicker">
            <Select onChange={opt => setHours(opt!.value)} value={hourSelect.find(opt => opt.value === hours)} className="half-field" options={hourSelect} />
            <Select onChange={opt => setMinutes(opt!.value)} value={minuteSelect.find(opt => opt.value === minutes)}  className="half-field" options={minuteSelect} />
        </div>
    )
}

export default HoursMillisPicker;