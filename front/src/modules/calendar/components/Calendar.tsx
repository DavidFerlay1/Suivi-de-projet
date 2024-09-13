import React,{ useCallback, useEffect, useMemo, useRef, useState } from "react"
import './calendar.scss'
import { useTranslation } from "react-i18next"
import { CalendarEvent } from "@interfaces/CalendarEvent"
import Dialog from "@components/dialogs/dialog/Dialog"
import CalendarEventForm from "../../../components/Form/forms/CalendarEventForm"
import useApi from "@hooks/useApi"
import CalendarEventItem from "./CalendarEventItem"
// import CalendarEventItem from "./CalendarEventItem"

type CalendarProps = {
    referenceDate: Date
}

type CalendarCellProps = {
    date: Date,
    onClick: Function,
    onEventClick: Function,
    className?: string,
    today: boolean,
    events: CalendarEvent[]
}

const initialDate = new Date();
initialDate.setHours(0);

const emptyEventForm: CalendarEvent = {
    title: '',
    description: '',
    invitations: [],
    beginDateMillis: initialDate.getTime(),
    endDateMillis: initialDate.getTime()
}

const Calendar = ({referenceDate}: CalendarProps) => {
    const [period, setPeriod] = useState<Date[]>([]);
    const {t} = useTranslation();
    const [periodEvents, setPeriodEvents] = useState<CalendarEvent[]>([]);

    const today = new Date();

    const [targetEvent, setTargetEvent] = useState(emptyEventForm);
    const [eventPopupOpen, setEventPopupOpen] = useState(false);
    const {calendarApi} = useApi();

    const getEvents = useCallback(async () => {
        if(period.length) {
            setPeriodEvents((await calendarApi.getForMonthRange(period[0]!, period[period.length - 1]!)).data.map((event: any) => (
                {...event, beginDateMillis: event.beginDate, endDateMillis: event.endDate}
            )));
        }
    }, [period])

    const isToday = useCallback((date: Date, ref: Date|undefined = undefined) => {
        if(!ref)
            ref = today

        return ref.getFullYear() === date.getFullYear() && ref.getDate() === date.getDate() && ref.getMonth() === date.getMonth();
    }, [today])

    const weekDays = [
        t('date.monday'),
        t('date.tuesday'),
        t('date.wednesday'),
        t('date.thursday'),
        t('date.friday'),
        t('date.saturday'),
        t('date.sunday')
    ]

    useEffect(() => {
        const month = referenceDate.getMonth();
        const year = referenceDate.getFullYear();

        const step = new Date(year, month, 1);
        
        const days: Date[] = [];
        let dayCounter = step.getDay() === 0 ? 6 : step.getDay() - 1;

        while(dayCounter > 0) {
            days.push(new Date(year, month, step.getDate() - dayCounter));
            dayCounter--;
        }

        while(month === step.getMonth() || step.getDay() !== 1) {
            days.push(new Date(step));
            step.setDate(step.getDate() + 1);
        }

        dayCounter = step.getDay() === 0 ? 6 : step.getDay() - 1;

        setPeriod(days);
    }, [referenceDate]);

    useEffect(() => {
        getEvents()
    }, [period])

    const onCellClick = (date: Date) => {
        setTargetEvent({
            ...emptyEventForm,
            beginDateMillis: date.getTime(),
            endDateMillis: date.getTime()
        })

        setEventPopupOpen(true)
    }

    const afterSubmit = () => {
        setEventPopupOpen(false);
        getEvents()
    }

    const onEventClick = (event: CalendarEvent) => {
        setTargetEvent(event)
        setEventPopupOpen(true)
    }

    return (
        <div className="calendarWrapper">
            <div className="calendarHeader">
                {weekDays.map(day => (
                    <span className="calendarHeaderCell">{day}</span>
                ))}
            </div>
            <div className="calendar">
                {period.map(date => <CalendarCell events={periodEvents.filter(event => isToday(new Date(event.beginDateMillis), date))} today={isToday(date)} className={date.getMonth() !== referenceDate.getMonth() ? 'out' : ''} onEventClick={onEventClick} onClick={onCellClick} date={date} />)}
            </div>
            <Dialog className="huge" isModal={true} isOpen={eventPopupOpen} setIsOpen={setEventPopupOpen} title={t('calendar.event.create')}>
                <CalendarEventForm afterSubmit={afterSubmit} target={targetEvent} />
            </Dialog>
        </div>
        
    )
}

const CalendarCell = ({date, onClick, onEventClick, className, today, events}: CalendarCellProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [tick, setTick] = useState(0);

    const repairTop = useMemo(() => {
        if(!today || !ref.current)
            return 0;

        const date = new Date();
        const value = date.getHours() * 60 + date.getMinutes();

        return ref.current.offsetHeight * (value / 1440);

    }, [today, ref.current, tick])

    useEffect(() => {
        setTick(1);

        let interval: any = undefined;
        if(today) {
            interval = setInterval(() => {
                if(tick === 10)
                    setTick(0)
                else(setTick(prev => prev + 1));
            }, 60000)
        }
        return () => clearInterval(interval);
    }, [tick])

    return (
        <div ref={ref} className={`calendarCell ${className ? className : ''}`} onClick={() => onClick(date)}>
            <span className="dateNumber">{date.getDate()}</span>
            {events.map((event: CalendarEvent) => (
                <CalendarEventItem event={event} onClick={() => {}} parentHeight={ref.current?.offsetHeight} />
            ))}

            {today && (
                <div className="today-repair" style={{top: repairTop}}></div>
            )}
           
        </div>
    )
}

export default Calendar;