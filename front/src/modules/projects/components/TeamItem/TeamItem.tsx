import React from 'react';
import {Team} from "@interfaces/Team";
import { useTranslation } from "react-i18next"
import './teamItem.scss';
import { LuPen, LuTrash2 } from 'react-icons/lu';

type TeamItemProps = {
    team: Team,
    onEdit: Function,
    onDelete: Function,
    classname?: string
}

const TeamItem = ({team, onEdit, onDelete, classname}: TeamItemProps) => {

    const {t} = useTranslation();

    return (
        <div className={`teamItem ${classname ? classname : ''}`}>
            <h4>{team.name}</h4>
            <button className='terciary nopadding'>{team.members.length} {t('misc.member')}{team.members.length > 1 ? 's' : ''}</button>
            <div className='actionList'>
                <button onClick={() => onEdit(team)} className='icon-button'><LuPen /></button>
                <button onClick={() => onDelete(team)} className='icon-button danger'><LuTrash2 /></button>
            </div>
        </div>
    )
}

export default TeamItem;