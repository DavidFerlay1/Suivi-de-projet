import MenuBar from "@components/MenuBar/MenuBar"
import AccessControlledLayout from "@security/AccessControlledLayout"
import React, { useMemo, useState } from "react"
import Calendar from "./components/Calendar"
import MonthSelector from "@components/formControls/MonthSelector/MonthSelector";
import YearSelector from "@components/YearSelector/YearSelector";

const CalendarPage = () => {

    const [selectedMonth, setSelectedMonth] = useState((new Date()).getMonth());
    const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear())

    const selectedDate = useMemo(() => {
        console.log(selectedYear, selectedMonth)
        const date = new Date();
        date.setMonth(selectedMonth);
        date.setFullYear(selectedYear);
        console.log(date)
        return date;
    }, [selectedMonth, selectedYear])

    return (
        <AccessControlledLayout roles={['ROLE_CALENDAR_EVENT_ACCESS']}>
            <MenuBar>
                <div style={{display: 'flex', gap: 8}}>
                    <MonthSelector value={selectedMonth} onChange={(month: number) => setSelectedMonth(month)} />
                    <YearSelector value={selectedYear} onChange={(year: number) => setSelectedYear(year)} />
                </div>        
            </MenuBar>
            <Calendar referenceDate={selectedDate} />
        </AccessControlledLayout>
    )
}

export default CalendarPage