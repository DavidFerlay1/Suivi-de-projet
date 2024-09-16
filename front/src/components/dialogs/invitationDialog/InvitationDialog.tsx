import Dialog from "../dialog/Dialog";
import { useTranslation } from "react-i18next";
import React from "react";
import { ApiCalendarEvent } from "@interfaces/CalendarEvent";
import useLitteral from "@hooks/useLitteral";
import useApi from "@hooks/useApi";
import { toast } from "react-toastify";
import './invitationDialog.scss'
import { IoMdCheckmark, IoMdClose, IoMdExit, IoMdTime } from "react-icons/io";

type InvitationDialogProps = {
    event: ApiCalendarEvent,
    isOpen: boolean,
    setIsOpen: Function,
    invitationId: number,
    onResponse?: () => void
}

const InvitationDialog = ({event, isOpen, setIsOpen, invitationId, onResponse}: InvitationDialogProps) => {
    const {t} = useTranslation();
    const {litteralDateMillis} = useLitteral();
    const {calendarApi} = useApi();

    const acceptOrDecline = (answer: 1|-1) => {
        calendarApi.answer(invitationId, answer).then(() => {
            if(answer) {
                toast("L'évênement a été ajouté à votre calendrier.", {type: 'success'});
            } else {
                toast("Votre réponse a été prise en compte.", {type: "success"})
            }
            
            if(onResponse)
                onResponse()
            else 
                (setIsOpen(false))
        })
    }

    return (
        <Dialog isModal={false} isOpen={isOpen} setIsOpen={setIsOpen} title={t('calendar.invitation.title')}>
            <h2 style={{padding: 0, margin: 0}}>{event.title}</h2>
            <p className="event-description">{event.description ?? t('calendar.invitation.noDescription')}</p>
            <p className="begin">{`Début: ${litteralDateMillis(event.beginDate)}`}</p>
            <p>{`Fin: ${litteralDateMillis(event.endDate)}`}</p>
            <div className="answer-choices">
                <button className="success" onClick={() => acceptOrDecline(1)}><IoMdCheckmark />{t('misc.accept')}</button>
                <button className="danger" onClick={() => acceptOrDecline(-1)}><IoMdClose />{t('misc.decline')}</button>
            </div>
        </Dialog>
    )
}

export default InvitationDialog;