import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import {PaginationSettings} from '../../interfaces/Api/Paginated';
import './paginator.scss';

type PaginatorProps = {
    data: PaginationSettings,
    onPageClick: Function
}

type PaginationButtonProps = {
    pageIndex: number,
    selected: boolean,
    onClick?: MouseEventHandler
}

const Paginator = ({data, onPageClick}: PaginatorProps) => {

    const [selectedPage, setSelectedPage] = useState(data.page);

    const onButtonClick = useCallback((pageIndex: number) => {
        if(pageIndex !== selectedPage) {
            setSelectedPage(pageIndex);
            onPageClick(pageIndex);
        }
    }, [selectedPage]);

    const paginationData = useMemo(() => {
        const result: PaginationButtonProps[] = [];
        let cumul = data.loaded;
        let pageIndex = data.page - 2;

        while(cumul < data.total && result.length < 5) {
            if(pageIndex) {
                cumul += pageIndex * data.perPage;
                result.push({pageIndex, selected: pageIndex === selectedPage});
            }

            pageIndex++;
        }

        if(!result.length)
            result.push({pageIndex: data.page, selected: data.page === selectedPage});

        return result;

    }, [data, selectedPage])

    return paginationData.length > 1 && (
        <div className='paginator'>
            <div className='pages'>
                {paginationData.map(data => <PaginationButton key={data.pageIndex} selected={data.selected} pageIndex={data.pageIndex} onClick={() => onButtonClick(data.pageIndex)} />)}
            </div>
        </div>
    )
}

const PaginationButton = ({pageIndex, onClick, selected}: PaginationButtonProps) => {
    return (
        <button onClick={onClick} className={selected ? "selected" : ''}>{pageIndex}</button>
    )
}

export default Paginator;