import axios from "axios"
import { useState } from "react";
import { Credentials, ResetPasswordFormData } from "@interfaces/FormData";
import { Project, SubmittableProject } from "@interfaces/Project";
// import { AuthTokens } from "./useAuth";
import { RoleProfile, SubmittablePersonal } from "@interfaces/Personal";
import { Team } from "@interfaces/Team";
import { QueryParams } from "@interfaces/QueryParams";

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
                const response = (await axios.post(`${httpClient.defaults.baseURL}/auth/refresh`, {refresh_token: refreshToken})).data;
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

    const withQueryParams = (uri: string, params: QueryParams) => {
        const {sortSettings, page, search, filters} = params;
        let finalUri = `${uri}?sortBy=${sortSettings.sort}&orderBy=${sortSettings.field}&page=${page}&search=${search}`

        const filterKeys = Object.keys(filters);
        if(filterKeys.length) {
            for(const filter of filterKeys) {
                finalUri += `&${filter}=${filters[filter]}`
            }
        }
        
        return finalUri;
    }

    const [projectApi] = useState({

        getList: (params: QueryParams) => {
            return httpClient.get(withQueryParams('/project', params));
        },

        createUpdate: (data: Project) => {
            return httpClient.post('/project', {data: data as SubmittableProject});
        },
    })

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

        getList : (params: QueryParams) => {
            return httpClient.get(withQueryParams('/personal', params));
        },

        fetchAllRoles: () => {
            return httpClient.get('/personal/roles')
        },

        fetchRoleProfileRoles: (roleProfile: RoleProfile) => {
            return httpClient.get(`/personal/roleProfiles/getRoles/${roleProfile.id}`);
        },

        getRoleProfileSuggestions: (params: QueryParams) => {
            return httpClient.get(withQueryParams('/personal/roleProfiles/search', params))
        },

        getAllRoleProfiles: (params: QueryParams) => {
            return httpClient.get(withQueryParams('/personal/roleProfiles', params));
        },

        createEditProfile: (data: SubmittablePersonal) => {
            return httpClient.post('/personal', {...data, roleProfiles: data.roleProfiles.map(roleProfile => roleProfile.id)});
        },

        delete: (id: number) => {
            return httpClient.delete(`/personal/${id}`)
        },

        createEditRoleProfile: (roleProfile: RoleProfile) => {
            return httpClient.post('/personal/roleProfiles', {...roleProfile});
        },
 
        deleteRoleProfile: (id: string|number) => {
            return httpClient.delete(`/personal/roleProfiles/${id}`)
        },

        importCSV: (formData: FormData) => {
            return httpClient.post('/personal/csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        },

        exportCSV: () => {
            return httpClient.get('/personal/csv', {responseType: 'blob'});
        },

        getCSVModel: () => {
            return httpClient.get('/personal/csv/model', {responseType: 'blob'});
        },

        checkCSVIntegrity: (formData: FormData) => {
            return httpClient.post('/personal/csv/import/integrity', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }
    })

    const [teamApi] = useState({
        getList: (params: QueryParams) => {
            return httpClient.get(withQueryParams('/project/team', params));
        },

        editOrCreate: (team: Team) => {

            const data = {...team, memberIds: team.members.map(m => m.id)} as any;
            delete data.members;

            return httpClient.post('/project/team', {...data});
        },

        delete: (team: Team) => {
            return httpClient.delete(`/project/team/${team.id}`);
        }
    })

    return {projectApi, authApi, personalApi, teamApi};
}

export default useApi;