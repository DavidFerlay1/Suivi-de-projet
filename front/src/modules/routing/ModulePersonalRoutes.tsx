import { Route, Routes } from "react-router"
import PersonalMonitoringHomePage from "@modules/personal/pages/home/PersonalMonitoringHomePage"
import RoleMonitoringHomePage from "@modules/personal/pages/RoleMonitoring/RoleMonitoringHomePage"
import React from "react"

const ModulePersonalRoutes = () => {
    return (
        <Routes>
            <Route path="/roles" element={<RoleMonitoringHomePage />}></Route>
            <Route path="/profiles" element={<PersonalMonitoringHomePage />}></Route>
        </Routes>
    )
}

export default ModulePersonalRoutes;