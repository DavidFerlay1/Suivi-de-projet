import React from "react"
import TeamMonitoringHomePage from "../team/TeamMonitoringHomePage/TeamMonitoringHomePage"
import { Route, Routes } from "react-router"
import ProjectMonitoringHomePage from "../project/ProjectMonitoringHomePage/ProjectMonitoringHomePage"

const ModuleProjectRoutes = () => {
    return (
        <Routes>
            <Route path='/list' element={<ProjectMonitoringHomePage />}></Route>
            <Route path='/team' element={<TeamMonitoringHomePage />}></Route>
        </Routes>
    )
}

export default ModuleProjectRoutes