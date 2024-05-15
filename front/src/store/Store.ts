import { configureStore } from "@reduxjs/toolkit";
import projectMonitoringSlice from "./slices/projectMonitoringSlice";
import userSlice from "./slices/userSlice";
import personalSlice from "./slices/personalSlice";

const Store = configureStore({
    reducer: {
        projectMonitoring: projectMonitoringSlice.reducer,
        user: userSlice.reducer,
        personal: personalSlice.reducer
    }
})

export default Store;
export type RootState = ReturnType<typeof Store.getState>;