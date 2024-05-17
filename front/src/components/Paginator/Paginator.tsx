import React, { ChangeEvent, FocusEvent, useContext } from 'react';
import './paginator.scss';
import { PaginationContext } from '../../contexts/PaginationContext';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

const Paginator = () => {
    const paginationContext = useContext(PaginationContext);

    const next = () => {
        paginationContext?.update(paginationContext.page + 1);
    }

    const previous = () => {
        paginationContext?.update(paginationContext.page - 1);
    }

    const onPageChange = (e: ChangeEvent<HTMLInputElement>) => {

        console.log(isNaN(Number(e.target.value)))

        if(!isNaN(Number(e.target.value)))
            paginationContext?.update(e.target.value);
    }

    const onFocus = (e: FocusEvent<HTMLInputElement>) => {
        e.target.select();
    }
    
    return (
        <div className='paginator'>
            <div className='chevron'>
                {paginationContext!.page > 1 && <a onClick={previous}><LuChevronLeft /></a>}
            </div>
            <input onFocus={onFocus} className='pageLog' value={paginationContext?.page} onChange={onPageChange} />
            <div className='chevron' onClick={next}>
                {paginationContext!.status === 'available' && <a onClick={next}><LuChevronRight /></a>}
            </div>
            
        </div>
    )
}

export default Paginator;