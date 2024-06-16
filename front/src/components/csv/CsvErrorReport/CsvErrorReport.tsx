import React from "react"
import { useTranslation } from "react-i18next"
import './csvErrorReport.scss'

type CsvErrorReportProps = {
    errors: any
}

const CsvErrorReport = ({errors}: CsvErrorReportProps) => {

    const {t} = useTranslation();

    return (
        <div className="errorReport">
            {Object.keys(errors).map((key: string, index: number) => (
                <div key={index}>
                    <h5>{t(`csv.errors.${key}`)}</h5>
                    <ul>
                        {errors[key].map((err: any, index: number) => (
                            <li key={index}>
                                <p>{t('csv.errors.line')} {err.line + 1}: {err.column}</p>
                                <p>{err.value && <span>{err.value}</span>} {t(err.reason)}</p>
                            </li>
                        ))}
                    </ul>
                </div>  
            ))} 
        </div>
    )
}

export default CsvErrorReport;