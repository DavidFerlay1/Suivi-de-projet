import React, { useContext } from "react";
import './sorter.scss';
import { LuArrowBigDown, LuArrowBigUp } from "react-icons/lu";
import { PaginationContext } from "../../contexts/PaginationContext";
import { SortContext } from "../../contexts/SortContext";

const Sorter = ({field}) => {
    const paginationContext = useContext(PaginationContext);
    const sortingContext = useContext(SortContext);

    const onClick = (sort: string) => {
        sortingContext?.update({field, sort});
        paginationContext?.update(1);
    }

    return (
        <div className="sorter">
            <LuArrowBigUp size={30} onClick={() => onClick('ASC')} className={`icon ${sortingContext?.current.field === field && sortingContext?.current.sort === 'ASC' ? 'selected' : ''}`} />
            <LuArrowBigDown size={30} className={`icon ${sortingContext?.current.field === field && sortingContext?.current.sort === 'DESC' ? 'selected' : ''}`} onClick={() => onClick('DESC')} />
        </div>
    )
}

export default Sorter;