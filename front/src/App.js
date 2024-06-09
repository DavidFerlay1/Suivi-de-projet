import { Provider } from 'react-redux';
import './App.css';
import ProjectMonitoringHomePage from './modules/projects/pages/ProjectMonitoringHomePage';
import React from 'react';
import Store from './store/Store';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage';
import LoginPage from './modules/auth/pages/LoginPage/LoginPage';
import ModulePersonalRoutes from './modules/personal/routing/ModulePersonalRoutes';
import NavigationBars from './components/navigation/NavigationBars/NavigationBars';
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModuleProjectRoutes from './modules/projects/routing/ModuleProjectRoutes';


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
        <Route path="/project/*" element={<ModuleProjectRoutes />} />
        <Route path="/auth/*" element={<ModuleAuthentication />} />
        <Route path="/personal/*" element={<ModulePersonalRoutes />} />
        <Route path="" element={<DashboardPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
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
