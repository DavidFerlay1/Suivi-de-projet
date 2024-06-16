import React, { ChangeEvent, useMemo, useState } from "react";
import { Project, ProjectStatus, ProjectTask } from "@interfaces/Project"
import ProgressBar from "@components/progressBar/ProgressBar";
import { useTranslation } from "react-i18next";
import './achievementProgressBar.scss'
import { IoMdWarning } from "react-icons/io";

export enum AchievementProgressUnit {
    COUNT = 'count',
    WEIGHT = 'weight'
}

export enum AchievementProgressType {
    PERCENT = 'percentage',
    ABSOLUTE = 'absolute'
}

type AchievementProgressBarProps = {
    target: Project|ProjectTask,
}

type Settings = {
    unit: AchievementProgressUnit,
    type: AchievementProgressType
}


const AchievementProgressBar = ({target}: AchievementProgressBarProps) => {

    const {t} = useTranslation();

    const [settings, setSettings] = useState<Settings>({
        unit: AchievementProgressUnit.WEIGHT,
        type: AchievementProgressType.PERCENT
    })

    const onSettingChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSettings({
            ...settings,
            [event.target.name]: event.target.value
        })
    }

    const data: {value: number, total: number} = useMemo(() => {
        if(target.tasks.length === 0)
            return {value: target.status === ProjectStatus.ACHIVIED ? 1 : 0, total: 1};

        const total = target.tasks.length;

        if(target.status === ProjectStatus.ACHIVIED)
            return {value: total, total};

        if(settings.unit === 'count') {
            return {value: target.tasks.filter(task => task.status === ProjectStatus.ACHIVIED).length, total};
        }

        return {
            value: target.tasks
                .filter(task => task.status === ProjectStatus.ACHIVIED)
                .map(task => task.weight)
                .reduce((acc, currentValue) => {
                    return (acc || 0) + (currentValue || 0);
                }, 0) || 0,
            total: 
                target.tasks
                    .map(task => task.weight)
                    .reduce((acc, currentValue) => {
                        return (acc || 0) + (currentValue || 0);
                    }, 0) || 0
        }
    }, [settings.unit, target])

    return (
        <>
            <ProgressBar label={t('misc.progression')} type={settings.type} max={data.total} value={data.value} style={{marginBottom: 8}} />
            {target.tasks.length ? 
                <div className="achievement-settings">
                    <select onChange={onSettingChange} name='type' value={settings.type}>
                        {Object.keys(AchievementProgressType).map((key: 'PERCENT' | 'ABSOLUTE') => <option key={key} value={AchievementProgressType[key]}>{t(`progressWording.${key}`)}</option>)}
                    </select>{t('progressWording.of')} 
                    <select onChange={onSettingChange} name='unit' value={settings.unit}>
                        {Object.keys(AchievementProgressUnit).map((key: 'COUNT'|'WEIGHT') => <option key={key} value={AchievementProgressUnit[key]}>{t(`progressWording.${key}`)}</option>)}
                    </select>{t('progressWording.achievedTasks')} 
                    <div className="alerts">
                        <IoMdWarning />
                    </div>
                </div> : null}
            
        </>
    )
} 

export default AchievementProgressBar;