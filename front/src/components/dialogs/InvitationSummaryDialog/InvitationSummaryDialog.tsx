import { CalendarEventInvitation } from "@interfaces/CalendarEvent"
import Dialog from "../dialog/Dialog"
import React, { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import "./invitationSummaryDialog.scss"
import useLitteral from "@hooks/useLitteral"
import useApi from "@hooks/useApi"
import { toast } from "react-toastify"
import { CalendarContext } from "@contexts/CalendarContext"


type InvitationDialogSummaryProps = {
    invitations: CalendarEventInvitation[],
    isOpen: boolean,
    setIsOpen: Function,
}

const InvitationSummaryDialog = ({invitations, isOpen, setIsOpen}: InvitationDialogSummaryProps) => {

    const {t} = useTranslation();
    const [currentInvitation, setCurrentInvitation] = useState(invitations[0]);
    const {litteralDateMillis} = useLitteral();
    const {calendarApi} = useApi();
    const [invitationList, setInvitationList] = useState(invitations);

    const context = useContext(CalendarContext);

    const invitationAnswer = (answer: -1|1) => {

        const currentId = currentInvitation!.id;

        calendarApi.answer(currentInvitation!.id, answer).then(() => {
            setInvitationList([...invitationList].filter(invitation => invitation.id !== currentId));
            context.refresh();
            toast("L'évênement a été ajouté à votre calendrier.", {type: "success"})
        })
    }

    useEffect(() => {
        if(invitationList.length)
            setCurrentInvitation(invitationList[0])
        else
            setCurrentInvitation(undefined);
    }, [invitationList])

    return (
        <Dialog className="huge" title={t('calendar.invitation.invitationSummary')} isModal={false} isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="invitations-summary">
                <ul className="invitations-list">
                    {invitationList.map(invitation => (
                        <li onClick={() => setCurrentInvitation(invitation)} key={invitation.id} className={currentInvitation && currentInvitation.id === invitation.id ? 'selected' : ''}>
                            {invitation.calendarEvent.title}
                        </li>
                    ))}
                </ul>
                <div className="invitation-informations">
                    {currentInvitation !== undefined ? (
                        <>
                            <h2>{currentInvitation?.calendarEvent.title}</h2>
                            <p style={{fontStyle: 'italic'}}>
                                {currentInvitation?.calendarEvent.description || t('calendar.invitation.noDescription')}
                            </p>
                            <p>{t('calendar.event.beginDate')} {litteralDateMillis(currentInvitation?.calendarEvent.beginDate)}</p>
                            <p>{t('calendar.event.endDate')}  {litteralDateMillis(currentInvitation?.calendarEvent.endDate)}</p>
                            <div className="buttons">
                                <button onClick={() => invitationAnswer(1)} className="success">{t('misc.accept')}</button>
                                <button onClick={() => invitationAnswer(-1)} className="danger">{t('misc.decline')}</button>
                            </div>
                        </>
                    ) : (
                        <p className="noInvitation">
                            {t('calendar.invitation.noInvitation')}
                        </p>
                    )}
                    
                </div>
            </div>
        </Dialog>
    )
}

export default InvitationSummaryDialog;