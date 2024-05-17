import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

type BreadCrumbData = {
    name: string,
    uri?: string
}

const BreadCrumb = () => {

    const location = useLocation();
    const {t} = useTranslation();

    const breadCrumbData = useMemo<BreadCrumbData[]>(() => {
        if(location.pathname === '/')
            return [{name: t('routes.dashboard.name')}];
        const splitted = location.pathname.split('/');
        splitted.shift();
        const path: string[] = [splitted[0]];

        const data: BreadCrumbData[] = [{name: t(`routes.${splitted[0]}.name`)}];

        for(let i = 1; i < splitted.length; i++) {
            path.push(splitted[i]);
            data.push({name: t(`routes.${path.join('.')}.name`), uri: `/${path.join('/')}`})
        }

        return data;

    }, [location.pathname])

    return (
        <div>{breadCrumbData.map((data, index) => (
                <>
                    {data.uri ? <Link to={data.uri}>{data.name}</Link> : <span>{data.name}</span>}
                    {index < breadCrumbData.length - 1 ? <span className='breadcrumb-separator'>></span> : null}
                </>
                
            ))}
        </div>
    )
}

export default BreadCrumb