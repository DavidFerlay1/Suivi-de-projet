import React, { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next"
import Tooltip from "../../tooltip/Tooltip";
import ToggleDialog from "../../dialogs/toggles/toggleDialog/ToggleDialog";

const DurationControl = ({value, onChange}) => {

    const [selectValue, setSelectValue] = useState(value !== undefined ? value / 86400000 : undefined);
    const {t} = useTranslation();

    const [test, setTest] = useState(false);

    useEffect(() => {
        let rest = 0;
        if(selectValue) {
            rest = selectValue % 0.5;
            setSelectValue((prev) => prev! - rest);
        }

        if(!rest)
            onChange(selectValue !== undefined ? selectValue * 86400000 : selectValue)
    }, [selectValue])

    return (
        <div className="form-group">
            <label>{t('misc.manTime')}</label>
            <input placeholder={t('misc.facultatif')} className="field" value={selectValue} type="number" onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectValue(parseFloat(e.target.value))} min={0} step={0.5} />
            <Tooltip top={true}>
                <p>Nécessaire au graphique de Gantt</p><p>ATTENTION: 0 et 'vide' ne sont pas équivalents.</p>
            </Tooltip>
            <Tooltip top={true}>
                <ToggleDialog title="test" isModal={false}>
                    <p>Hello world</p>
                </ToggleDialog>
            </Tooltip>
        </div>
    )
}

export default DurationControl;