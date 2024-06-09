import React from "react"
import TeamMonitoringHomePage from "../team/TeamMonitoringHomePage/TeamMonitoringHomePage"
import { Route, Routes } from "react-router"

const ModuleProjectRoutes = () => {
    return (
        <Routes>
            <Route path='/team' element={<TeamMonitoringHomePage />}></Route>
        </Routes>
    )
}

export default ModuleProjectRoutes