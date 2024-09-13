import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './moduleMenuItem.scss';
import { ModuleData } from "@hooks/useModules";
import { useTranslation } from "react-i18next";

type ModuleMenuItemProps = {
    module: ModuleData,
}

const ModuleMenuItem = ({module}: ModuleMenuItemProps) => {

    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="moduleItem" onClick={() => !module.submodules.length && navigate(module.baseUri)}>
            {module.icon}
            {module.submodules.length ? (
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
            ) : null}
        </div>
    )
}

export default ModuleMenuItem