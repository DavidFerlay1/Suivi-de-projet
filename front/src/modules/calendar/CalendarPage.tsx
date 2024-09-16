import MenuBar from "@components/MenuBar/MenuBar"
import AccessControlledLayout from "@security/AccessControlledLayout"
import React, { useEffect, useMemo, useState } from "react"
import Calendar from "./components/Calendar"
import MonthSelector from "@components/formControls/MonthSelector/MonthSelector";
import YearSelector from "@components/YearSelector/YearSelector";
import { useTranslation } from "react-i18next";
import useApi from "@hooks/useApi";
import { CalendarEventInvitation } from "@interfaces/CalendarEvent";
import { useSelector } from "react-redux";
import './calendarPage.scss'
import InvitationSummaryDialog from "@components/dialogs/InvitationSummaryDialog/InvitationSummaryDialog";
import { CalendarContextProvider } from "@contexts/CalendarContext";
import { AccessContext, AccessContextProvider } from "@contexts/AccessContext";

const CalendarPage = () => {

    const [selectedMonth, setSelectedMonth] = useState((new Date()).getMonth());
    const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear());
    const {t} = useTranslation();
    const {calendarApi} = useApi();
    const [pendingInvitations, setPendingInvitations] = useState<CalendarEventInvitation[]>([]);
    const {notifications} = useSelector((state: any) => state.notifications.notifications);

    const [isInvitationSummaryOpen, setIsInvitationSummaryOpen] = useState(false);

    const selectedDate = useMemo(() => {
        const date = new Date();
        date.setMonth(selectedMonth);
        date.setFullYear(selectedYear);
        return date;
    }, [selectedMonth, selectedYear])

    useEffect(() => {
        calendarApi.getInvitations().then(res => setPendingInvitations(res.data));
    }, [notifications])

    return (
        <AccessControlledLayout roles={['ROLE_MODULE_CALENDAR']}>
            <AccessContextProvider required={['ROLE_CALENDAR_EVENT_ACCESS', 'ROLE_CALENDAR_EVENT_CREATE']}>
                <MenuBar>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        <div style={{display: 'flex', gap: 8}}>
                            <MonthSelector value={selectedMonth} onChange={(month: number) => setSelectedMonth(month)} />
                            <YearSelector value={selectedYear} onChange={(year: number) => setSelectedYear(year)} />
                        </div>
                        <div className="invitations-summary-button-wrapper">
                            {pendingInvitations.length > 0 && <span className="invitations-count">{pendingInvitations.length < 10 ? pendingInvitations.length : '9+'}</span>}
                            <button onClick={() => setIsInvitationSummaryOpen(true)}>{t('calendar.event.pendingInvitation')}</button>
                        </div>
                    </div>        
                </MenuBar>
                <CalendarContextProvider>
                    <InvitationSummaryDialog isOpen={isInvitationSummaryOpen} setIsOpen={setIsInvitationSummaryOpen} invitations={pendingInvitations} />
                    <Calendar referenceDate={selectedDate} />
                </CalendarContextProvider>
            </AccessContextProvider>
            
        </AccessControlledLayout>
    )
}

export default CalendarPage