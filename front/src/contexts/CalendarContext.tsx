import useApi from "@hooks/useApi"
import { CalendarEvent } from "@interfaces/CalendarEvent"
import { ReactNode, createContext, useCallback, useEffect, useState } from "react"
import React from "react"

type CalendarContextProviderProps = {
    children: ReactNode
}

type CalendarContextValue = {
    period: Date[],
    periodEvents: CalendarEvent[],
    refresh: () => void,
    updatePeriod: (p: Date[]) => void
}

const CalendarContext = createContext<CalendarContextValue>({
    period: [],
    periodEvents: [],
    refresh: () => {},
    updatePeriod: (p: Date[]) => {}
})

const CalendarContextProvider = ({children}: CalendarContextProviderProps) => {
    const [period, setPeriod] = useState<Date[]>([]);
    const [periodEvents, setPeriodEvents] = useState<CalendarEvent[]>([]);
    const {calendarApi} = useApi();

    useEffect(() => {
        refresh();
    }, [period])

    const refresh = useCallback(async () => {
        try {
            if(period.length) {
                setPeriodEvents((await calendarApi.getForMonthRange(period[0]!, period[period.length - 1]!)).data.map((event: any) => (
                    {...event, beginDateMillis: event.beginDate, endDateMillis: event.endDate}
                )));
            }
        } catch (error) {

        }
    }, [period, periodEvents]);

    return (
        <CalendarContext.Provider value={{refresh, period, periodEvents, updatePeriod: (d: Date[]) => setPeriod(d)}}>
            {children}
        </CalendarContext.Provider>
    )
}

export {CalendarContext, CalendarContextProvider}