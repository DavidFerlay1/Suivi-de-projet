import React, { Route, Routes } from "react-router"
import PersonalMonitoringHomePage from "../pages/home/PersonalMonitoringHomePage"
import RoleMonitoringHomePage from "../pages/RoleMonitoring/RoleMonitoringHomePage";

const ModulePersonalRoutes = () => {
    return (
        <Routes>
            <Route path="/roles" element={<RoleMonitoringHomePage />}></Route>
            <Route path="/profiles" element={<PersonalMonitoringHomePage />}></Route>
        </Routes>
    )
}

export default ModulePersonalRoutes;