import React, { MouseEventHandler } from "react";
import './roleProfileItem.scss';
import { RoleProfile } from "../../../../../../interfaces/Personal";
import { LuPen, LuTrash2 } from "react-icons/lu";

type RoleProfileItemProps = {
    roleProfile: RoleProfile,
    onDeleteClick: Function,
    onEditClick: Function
}

const RoleProfileItem = ({roleProfile, onEditClick, onDeleteClick}: RoleProfileItemProps) => {
    return (
        <div className="roleProfileItem">
            <span>{roleProfile.name}</span>
            <div className="actionGroup">
                <button className="icon-button" onClick={() => onEditClick(roleProfile)}><LuPen /></button>
                <button className="icon-button danger" onClick={() => onDeleteClick(roleProfile)}><LuTrash2 /></button>
            </div>
        </div>
    )
}

export default RoleProfileItem;