import React, { ReactNode } from "react";
import './paginatedLayout.scss';
import Paginator from "../../navigation/Paginator/Paginator";

type PaginatedLayoutProps = {
    children: ReactNode
}

const PaginatedLayout = ({children}: PaginatedLayoutProps) => {
    return (
        <div className="paginated-layout">
            {children}
            <Paginator />
        </div>
    )
}

export default PaginatedLayout;