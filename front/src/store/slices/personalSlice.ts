import { createSlice } from "@reduxjs/toolkit";
import { SortSetting } from "src/interfaces/Api/SortSetting";
import { Personal } from "src/interfaces/Personal";

type SliceState = {profiles: Personal[], profilesSortSetting: SortSetting};

const initialState: SliceState = {
    profiles: [],
    profilesSortSetting: {field: 'lastName', sort: 'ASC'}
}

const personalSlice = createSlice({
    name: 'personal',
    initialState,
    reducers: {
        setProfiles: (state, action) => {
            state.profiles = action.payload;
        },

        updateProfile: (state, action) => {
            const {data, isNew} = action.payload;

            if(isNew) {
                state.profiles = [...state.profiles, data];
            } else {
                state.profiles = state.profiles.map(p => {
                    if(p.id === data.id) {
                        return data;
                    }
                    return p;
                })
            }

            return state;
        },

        updateProfilesSortSettings: (state, action) => {
            const setting: SortSetting = action.payload;
            state.profilesSortSetting = setting;
            const copy = [...state.profiles];

            copy.sort((a: Personal, b: Personal) => {
                if(action.payload.sort === 'ASC')
                    return a[setting.field] < b[setting.field] ? -1 : a[setting.field] > b[setting.field] ? 1 : 0;
                else
                    return a[setting.field] < b[setting.field] ? 1 : a[setting.field] > b[setting.field] ? -1 : 0;
            });

            state.profiles = copy;
        }
    }
})

export default personalSlice;
export const {setProfiles, updateProfile, updateProfilesSortSettings} = personalSlice.actions; 