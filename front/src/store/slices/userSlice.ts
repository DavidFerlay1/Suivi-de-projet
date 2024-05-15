import { createSlice } from "@reduxjs/toolkit";

type SliceState = {
    permissions: {
        data: string[],
        ready: boolean,
    }
}

const initialState: SliceState = {
    permissions: {
        data: [],
        ready: false
    }
} 

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        initPermissions: (state, action) => {
            state.permissions = {
                data: action.payload,
                ready: true
            }
        },
        revokePermissions: (state) => {
            state.permissions = {
                data: [],
                ready: false
            }
        }
    }
})

export const {initPermissions, revokePermissions} = userSlice.actions;
export default userSlice;