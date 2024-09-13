import React, { useContext } from "react";
import './sorter.scss';
import { LuArrowDown, LuArrowUp } from "react-icons/lu";
import { PaginationContext } from "../../contexts/PaginationContext";
import { SortContext } from "../../contexts/SortContext";

type SorterProps = {
    field: string
}

const Sorter = ({field}: SorterProps) => {
    const paginationContext = useContext(PaginationContext);
    const sortingContext = useContext(SortContext);

    const onClick = (sort: string) => {
        sortingContext?.update({field, sort});
        paginationContext?.update(1);
    }

    return (
        <div className="sorter">
            <LuArrowUp size={18} onClick={() => onClick('ASC')} className={`icon ${sortingContext?.current.field === field && sortingContext?.current.sort === 'ASC' ? 'selected' : ''}`} />
            <LuArrowDown size={18} className={`icon ${sortingContext?.current.field === field && sortingContext?.current.sort === 'DESC' ? 'selected' : ''}`} onClick={() => onClick('DESC')} />
        </div>
    )
}

export default Sorter;