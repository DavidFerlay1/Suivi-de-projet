import React from "react";
import { LuHome } from "react-icons/lu";
import { useNavigate } from "react-router";
import useModules from "../../../hooks/useModules";
import ModuleMenuItem from "./ModuleMenuItem/ModuleMenuItem";
import './sidebar.scss'

const Sidebar = () => {

    const navigate = useNavigate();

    const availableModules = useModules();

    return (
        <nav>
            <div className="home-button-wrapper">
                <LuHome key='HOME' size={26} color='white' onClick={() => navigate('/')} />
            </div>
            <div className="module-list">
                {availableModules.map((module, index) => (
                    <ModuleMenuItem key={index} module={module} />
                ))}
            </div>
            
        </nav>
    )
}

export default Sidebar