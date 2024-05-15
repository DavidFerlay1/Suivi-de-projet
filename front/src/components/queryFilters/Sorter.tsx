import { useDispatch, useSelector } from "react-redux"
import { updateProfilesSortSettings } from "../../store/slices/personalSlice";
import React, { useEffect, useState } from "react";
import './sorter.scss';
import { LuArrowBigDown, LuArrowBigUp } from "react-icons/lu";

const Sorter = ({field}) => {

    const dispatch = useDispatch();
    const selected = useSelector((state: any) => state.personal.profilesSortSetting);

    const onClick = (sort: string) => {
        dispatch(updateProfilesSortSettings({field, sort}))
    }

    return (
        <div className="sorter">
            <LuArrowBigUp size={30} onClick={() => onClick('ASC')} className={`icon ${selected.field === field && selected.sort === 'ASC' ? 'selected' : ''}`} />
            <LuArrowBigDown size={30} className={`icon ${selected.field === field && selected.sort === 'DESC' ? 'selected' : ''}`} onClick={() => onClick('DESC')} />
        </div>
    )
}

export default Sorter;