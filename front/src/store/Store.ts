import { configureStore } from "@reduxjs/toolkit";
import projectMonitoringSlice from "./slices/projectMonitoringSlice";
import userSlice from "./slices/userSlice";
import notificationSlice from "./slices/notificationSlice";

const Store = configureStore({
    reducer: {
        projectMonitoring: projectMonitoringSlice.reducer,
        user: userSlice.reducer,
        notifications: notificationSlice.reducer
    }
})

export default Store;
export type RootState = ReturnType<typeof Store.getState>;