import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";

const RoleOrganizer = ({data, onChange}) => {

    const {t} = useTranslation();

    const [currentTabIndex, setCurrentTabIndex] = useState('PROJECT');

    const onCheck = (value: boolean, role: string) => {
        onChange(value, role)
    }

    return Object.keys(data).length && (
        <div className="">
            <select value={currentTabIndex} onChange={e => setCurrentTabIndex(e.target.value)}>
                {Object.keys(data).map((key, index) => <option key={key} value={key}>{t(`roles.${key}`)}</option>)}
            </select>
            <div>
                {Object.keys(data[currentTabIndex]).map(feature => {
                    return (
                        <div>
                            <h2>{t(`roles.${feature}`)}</h2>
                            {Object.keys(data[currentTabIndex][feature]).map(right => {
                                return (
                                    <>
                                        <label>{t(`roles.${right}`)}</label>
                                        <input type='checkbox' checked={data[currentTabIndex][feature][right]} onChange={e => onCheck(e.target.checked, `ROLE_${currentTabIndex}_${feature}_${right}`)} />
                                    </>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RoleOrganizer