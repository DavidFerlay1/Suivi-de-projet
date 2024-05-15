import { Provider } from 'react-redux';
import './App.css';
import ProjectMonitoringHomePage from './modules/projects/pages/ProjectMonitoringHomePage';
import React, { useEffect } from 'react';
import Store from './store/Store';
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage';
import LoginPage from './modules/auth/pages/LoginPage/LoginPage';
import ModulePersonalRoutes from './modules/personal/routing/ModulePersonalRoutes';
import NavigationBars from './components/header/Header';
import DashboardPage from './modules/dashboard/pages/DashboardPage';


function App() {
  return (
    <Provider store={Store}>
      <InnerApp />
    </Provider>
    
  );
}

const InnerApp = () => {

  return (
    <BrowserRouter>
      <NavigationBars />
      <Routes>
        <Route path="/project" element={<ModuleProjectMonitoring />} />
        <Route path="/auth/*" element={<ModuleAuthentication />} />
        <Route path="/personal/*" element={<ModulePersonalRoutes />} />
        <Route path="" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

const ModuleProjectMonitoring = () => {
  return (
    <Routes>
      <Route path="*" element={<ProjectMonitoringHomePage />}/>
    </Routes>
  )
}

const ModuleAuthentication = () => {
  return (
    <Routes>
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="" element={<LoginPage />} />
    </Routes>
  )
}

export default App;
