import React, { Route, Routes } from "react-router"
import PersonalMonitoringHomePage from "../pages/home/PersonalMonitoringHomePage"

const ModulePersonalRoutes = () => {
    return (
        <Routes>
            <Route path="" element={<PersonalMonitoringHomePage />}></Route>
        </Routes>
    )
}

export default ModulePersonalRoutes;