import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import './roleOrganizer.scss'

const RoleOrganizer = ({data, onChange}) => {

    const {t} = useTranslation();

    const [currentTabIndex, setCurrentTabIndex] = useState('PROJECT');

    const onCheck = (value: boolean, role: string) => {
        onChange(value, role)
    }

    return Object.keys(data).length && (
        <div className="roleOrganizer">
            <div style={{height: 30}}>
                <select value={currentTabIndex} onChange={e => setCurrentTabIndex(e.target.value)}>
                    {Object.keys(data).map((key, index) => <option key={key} value={key}>{t(`roles.${key}`)}</option>)}
                </select>
            </div>
            <div className="roles">
                {Object.keys(data[currentTabIndex]).map(feature => {
                    return (
                        <div>
                            <h2>{t(`roles.${feature}`)}</h2>
                            <ul>
                                {Object.keys(data[currentTabIndex][feature]).map((right, index) => {
                                    return (
                                        <li key={index}>
                                            <input type='checkbox' checked={data[currentTabIndex][feature][right]} onChange={e => onCheck(e.target.checked, `ROLE_${currentTabIndex}_${feature}_${right}`)} />
                                            <label>{t(`roles.${right}`)}</label>
                                        </li>
                                    )
                                })}
                            </ul>
                            
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RoleOrganizer