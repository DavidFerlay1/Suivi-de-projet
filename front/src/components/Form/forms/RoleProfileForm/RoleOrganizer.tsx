import React, { useState } from "react"
import { useTranslation } from "react-i18next";
import './roleOrganizer.scss'

type RoleOrganizerProps = {
    data: any,
    onChange: Function,
    onMultipleChange: (roles: any[]) => void
}

const RoleOrganizer = ({data, onChange, onMultipleChange}: RoleOrganizerProps) => {

    const {t} = useTranslation();

    const [currentTabIndex, setCurrentTabIndex] = useState('PROJECT');

    const onCheck = (value: boolean, role: string) => {
        onChange(value, role)
    }

    console.log('FIRST', data)

    const onModuleCheck = (value: boolean, moduleAccessRole: string) => {
        const moduleKeyword = moduleAccessRole.split('_').at(-1);
        if(moduleKeyword) {
            const dataCopy = {...data};
            const moduleCopy = dataCopy[moduleKeyword];
            recursivelyAlterAllSubmodules(moduleCopy, value);
            onMultipleChange({...data, [moduleKeyword]: moduleCopy});
        }
    }

    const recursivelyAlterAllSubmodules = (module: any, value: boolean, newModule: any = {}, previousKeys: string[] = []) => {
        const keys = Object.keys(module);
        for(const key of keys) {
            if(previousKeys.length === 0) {
                if(typeof module[key] === 'boolean') {
                    module[key] = value;
                } else {
                    newModule[key] = module[key];
                    recursivelyAlterAllSubmodules(module[key], value, newModule, [...previousKeys, key]);
                }
            } else {
                if(typeof module[key] === 'boolean') {
                    const target = previousKeys.reduce((acc, key) => acc[key], newModule);
                    target[key] = value;
                } else {
                    recursivelyAlterAllSubmodules(module[key], value, newModule, [...previousKeys, key]);
                }
            }
        }
    }

    return Object.keys(data).length ? (
        <div className="roleOrganizer">
            <div style={{height: 30}}>
                <select value={currentTabIndex} onChange={e => setCurrentTabIndex(e.target.value)}>
                    {Object.keys(data).map((key) => <option key={key} value={key}>{t(`roles.${key}`)}</option>)}
                </select>
            </div>
            <div className="roles">
                {Object.keys(data[currentTabIndex]).map(feature => {
                    return !feature.match(/ROLE_MODULE_(\w+)/) ? (
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
                    ) : (
                        <div className="module_access_checkbox_wrapper">
                            <input checked={data[currentTabIndex][feature]} type='checkbox' onChange={e => onModuleCheck(e.target.checked, feature)} />
                            <h2>{t('roles.module_access')}</h2>
                        </div>
                    )
                })}
            </div>
        </div>
    ) : null
}

export default RoleOrganizer