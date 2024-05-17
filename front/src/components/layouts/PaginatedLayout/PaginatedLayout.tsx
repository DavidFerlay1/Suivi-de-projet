import React from "react";
import './paginatedLayout.scss';
import Paginator from "../../navigation/Paginator/Paginator";

const PaginatedLayout = ({children}) => {
    return (
        <div className="paginated-layout">
            {children}
            <Paginator data={{loaded: 1, page: 1, perPage: 1, total: 1}} />
        </div>
    )
}

export default PaginatedLayout;