import React from "react";
import { Link } from "react-router-dom";
import './moduleMenuItem.scss';
import { ModuleData } from "../../../../hooks/useModules";
import { useTranslation } from "react-i18next";

type ModuleMenuItemProps = {
    module: ModuleData,
}

const ModuleMenuItem = ({module}: ModuleMenuItemProps) => {

    const {t} = useTranslation();

    return (
        <div className="moduleItem">
            {module.icon}
            <div>
                <div>
                    <h2>{t(module.title)}</h2>
                    <ul>
                        {module.submodules.map((submodule, index) => (
                            <li key={index}><Link to={module.baseUri+submodule.uri}>{submodule.icon}{t(submodule.title)}</Link></li>
                        ))}
                    </ul>
                </div>
                
            </div>
            
        </div>
    )
}

export default ModuleMenuItem