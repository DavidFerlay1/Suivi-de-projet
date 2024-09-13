import { Notification } from "@interfaces/Notification";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SliceState = {notifications: Notification[]};

const initialState: SliceState = {
    notifications: []
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            if(!state.notifications.find(n => n.id === action.payload.id))
                state.notifications.push(action.payload);

            return state;
        },

        addNotifications: (state, action: PayloadAction<Notification[]>) => {
            for(const notif of action.payload)
                if(!state.notifications.find(n => n.id === notif.id))
                    state.notifications.push(notif);

            return state;
        },

        removeNotification: (state, action: PayloadAction<number>) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
            return state;
        },

        removeAll: (state) => {
            state.notifications = [];
            return state;
        }
    }
})

export const {addNotification, addNotifications, removeNotification, removeAll} = notificationSlice.actions;
export default notificationSlice;