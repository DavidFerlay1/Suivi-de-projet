import { Provider, useDispatch } from 'react-redux';
import './App.css';
import React, { useEffect } from 'react';
import Store from './store/Store';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage';
import LoginPage from './modules/auth/pages/LoginPage/LoginPage';
import NavigationBars from './components/navigation/NavigationBars/NavigationBars';
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModuleProjectRoutes from '@modules/routing/ModuleProjectRoutes';
import ModulePersonalRoutes from '@modules/routing/ModulePersonalRoutes';
import CalendarPage from '@modules/calendar/CalendarPage';
import useAuth, {AuthProvider} from '@hooks/useAuth';
import useApi from '@hooks/useApi';
import useWebsocket from '@hooks/useWebsocket';
import { addNotifications } from './store/slices/notificationSlice';


function App() {
  return (
    <Provider store={Store}>
      <InnerApp />
    </Provider>
    
  );
}

const InnerApp = () => {

  return (
    <AuthProvider>
      <WebsocketStack>
        <BrowserRouter>
            <NavigationBars />
            <Routes>
              <Route path="/project/*" element={<ModuleProjectRoutes />} />
              <Route path="/auth/*" element={<ModuleAuthentication />} />
              <Route path="/personal/*" element={<ModulePersonalRoutes />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="" element={<DashboardPage />} />
            </Routes>
            <ToastContainer />
          </BrowserRouter>
      </WebsocketStack>
    </AuthProvider>
    
  )
}

const WebsocketStack = ({children}) => {
  const {authenticated} = useAuth();
  const {readyState, openConnection, closeConnection} = useWebsocket();
  const {notificationApi} = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if(authenticated && readyState !== WebSocket.OPEN) {
      openConnection();
    } else if(readyState === WebSocket.OPEN && !authenticated) {
      closeConnection()
    }
  }, [authenticated, readyState, openConnection, closeConnection])

  useEffect(() => {
    if(authenticated)
      notificationApi.getNotifications().then(response => {
        dispatch(addNotifications(response.data));
      })
  }, [authenticated])

  return children
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
