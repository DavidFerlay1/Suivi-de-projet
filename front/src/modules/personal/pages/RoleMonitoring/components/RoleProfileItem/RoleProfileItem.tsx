import React, { MouseEventHandler } from "react";
import './roleProfileItem.scss';
import { RoleProfile } from "../../../../../../interfaces/Personal";
import { LuPen, LuTrash2 } from "react-icons/lu";
import Tooltip from "../../../../../../components/tooltip/Tooltip";
import { useTranslation } from "react-i18next";

type RoleProfileItemProps = {
    roleProfile: RoleProfile,
    onDeleteClick: Function,
    onEditClick: Function
}

const RoleProfileItem = ({roleProfile, onEditClick, onDeleteClick}: RoleProfileItemProps) => {

    const {t} = useTranslation();

    return (
        <div className={`roleProfileItem ${roleProfile.immutable ? 'immutable' : ''}`}>
            <span>{roleProfile.name}</span>
            {!roleProfile.immutable && 
                <div className="actionGroup">
                    <button className="icon-button" onClick={() => onEditClick(roleProfile)}><LuPen /></button>
                    <button className="icon-button danger" onClick={() => onDeleteClick(roleProfile)}><LuTrash2 /></button>
                </div>
            }
            {roleProfile.immutable && <div className="actionGroup"><Tooltip><span>{t('roleProfile.immutable')}</span></Tooltip></div>}
        </div>
    )
}

export default RoleProfileItem;