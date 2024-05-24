import axios from "axios"
import { useState } from "react";
import { Credentials, ResetPasswordFormData } from "../interfaces/FormData";
import { Project, SubmittableProject } from "../interfaces/Project";
import { AuthTokens } from "./useAuth";
import { SensitiveSafeSubmittablePersonal, SubmittablePersonal } from "../interfaces/Personal";
import { SortSetting } from "../interfaces/Api/SortSetting";

export const httpClient = axios.create({
    baseURL: 'http://localhost/api',
});

httpClient.interceptors.request.use((config: any) => {
    config.headers!['Content-Type'] = 'application/json';

    const jwt = localStorage.getItem('token');
    if(jwt)
        config.headers!['Authorization'] = `Bearer ${jwt}`;

    return config;
}, error => {
    Promise.reject(error);
});

httpClient.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refresh_token');
        if(refreshToken) {
            try {
                const response = (await axios.post(`${httpClient.defaults.baseURL}/auth/refresh`, {refresh_token: refreshToken})).data as AuthTokens;
                localStorage.setItem('token', response.token);
                localStorage.setItem('refresh_token', response.refresh_token);
                httpClient.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
                return httpClient(originalRequest);
            } catch (authError) {
                console.log("CATCH AUTH ERROR FROM HTTP CLIENT")
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/auth'
            }
        } 
    }

    return Promise.reject(error);
})

const useApi = () => {

    const [projectApi] = useState({
        create: (data: Project) => {
            return httpClient.post('/project', {data: data as SubmittableProject});
        },
    })

    const withFilterParams = (uri: string, page: number, sortSetting: SortSetting, searchPattern: string = '') => {
        return `${uri}?sortBy=${sortSetting.sort}&orderBy=${sortSetting.field}&page=${page}&search=${searchPattern}`
    }

    const [authApi] = useState({
        login: (credentials: Credentials) => {
            return httpClient.post('/auth/login', credentials);
        },

        logout: () => {
            return httpClient.get('/auth/logout');
        },

        resetPasswordRequest: (username: string) => {
            return httpClient.post('/auth/password/request', {username});
        },

        resetPassword: (formData: ResetPasswordFormData) => {
            return httpClient.post('/auth/password/reset', formData)
        },

        refreshToken: (refresh_token: string) => {
            return httpClient.post('/auth/refresh', {refresh_token})
        },

        controlAccess: (roles: string[]) => {
            return httpClient.get('/auth/isGranted', {params: {roles: JSON.stringify(roles)}})
        },

        getModuleAccesses: () => {
            return httpClient.get('/auth/moduleAccesses');
        },

        requirePermissions: (roles: string[]) => {
            return httpClient.get('/auth/requirePermissions', {params: {roles: JSON.stringify(roles)}});
        }
    })

    const [personalApi] = useState({

        getList : (page: number, sortSetting: SortSetting, search: string) => {
            return httpClient.get(withFilterParams('/personal', page, sortSetting, search));
        },

        fetchAllRoles: () => {
            return httpClient.get('/personal/roles')
        },

        getRoleProfileSuggestions: (page: number, sortSetting: SortSetting, search: string) => {
            return httpClient.get(withFilterParams('/personal/roleProfiles/search', page, sortSetting, search))
        },

        getAllRoleProfiles: () => {
            return httpClient.get('/personal/roleProfiles');
        },

        createEditProfile: (data: SubmittablePersonal) => {
            return httpClient.post('/personal', {...data, roleProfiles: data.roleProfiles.map(roleProfile => roleProfile.id)});
        },

        delete: (id: number) => {
            return httpClient.delete(`/personal/${id}`)
        },

        deleteRoleProfile: (id: string|number) => {
            return httpClient.delete(`/personal/roleProfile/${id}`)
        }
    })

    return {projectApi, authApi, personalApi};
}

export default useApi;