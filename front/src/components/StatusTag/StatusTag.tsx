import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ProjectStatus } from "../../interfaces/Project"
import './statusTag.scss';

type StatusTagProps = {
    status: number
}

const StatusTag = ({status}: StatusTagProps) => {

    const {t} = useTranslation();

    const tagData = useMemo(() => {

        switch(status) {
            case ProjectStatus.ACHIVIED:
                return {color: "success", label: t('status.achieved')};
            case ProjectStatus.IN_PROGRESS:
                return {color: "alert", label: t('status.inProgress')};
            default: return {color: 'danger', label: t('misc.unknown')};
        }
    }, [status])

    return (
        <label className="status-tag" style={{backgroundColor: `var(--${tagData.color})`}}>{tagData.label}</label>
    )
}

export default StatusTag;