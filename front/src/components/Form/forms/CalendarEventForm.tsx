import Form, { CatchableField } from "@components/Form/Form";
import PersonalSelector from "@components/PersonalSelector/PersonalSelector";
import DateMillisPicker from "@components/formControls/DateMillisPicker/DateMillisPicker";
import HoursMillisPicker from "@components/formControls/HoursMillisPicker/HoursMillisPicker";
import useApi from "@hooks/useApi";
import { CalendarEvent } from "@interfaces/CalendarEvent";
import { SubmittablePersonal } from "@interfaces/Personal";
import { on } from "events";
import React, { ChangeEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type CalendarEventFormProps = {
    target: CalendarEvent,
    afterSubmit?: () => void
}

const CalendarEventForm = ({target, afterSubmit}: CalendarEventFormProps) => {

    const [values, setValues] = useState<CalendarEvent>(target);
    const {t} = useTranslation();
    const {calendarApi} = useApi();

    const onSubmit = () => {
        calendarApi.createUpdate(values).then(() => {
            toast(t("calendar.event.created", {type: "success"}));

            if(afterSubmit)
                afterSubmit();
        })
    }

    const canSubmit = useMemo(() => {
        return values.title !== '' && values.beginDateMillis < values.endDateMillis;
    }, [values])

    const onEdit = (name: string, value: any) => {
        setValues({...values, [name]: value});
    }

    return (
        <Form onSubmit={onSubmit} canSubmit={canSubmit}>
            <CatchableField label={t('calendar.event.title')}>
                <input className="field" value={values.title} onChange={e => onEdit('title', e.target.value)} />
            </CatchableField>
            <CatchableField label={t('calendar.event.beginDate')}>
                <DateMillisPicker dateMillis={values.beginDateMillis} onChange={(dateMillis: number) => onEdit('beginDateMillis', dateMillis)} />
            </CatchableField>
            <CatchableField label={t('calendar.event.endDate')}>
                <DateMillisPicker dateMillis={values.endDateMillis} onChange={(dateMillis: number) => onEdit('endDateMillis', dateMillis)} />
            </CatchableField>
            <CatchableField label={t('calendar.event.description')}>
                <textarea value={values.description} onChange={e => onEdit('description', e.target.value)}></textarea>
            </CatchableField>
            <CatchableField label={t('calendar.event.invitations')}>
                <PersonalSelector value={values.invitations} onChange={(targets: SubmittablePersonal[]) => onEdit('invitations', targets)} />
            </CatchableField>
        </Form>
    )
}

export default CalendarEventForm;