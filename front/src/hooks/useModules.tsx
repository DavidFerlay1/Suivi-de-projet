import React,{ useEffect, useState } from "react"
import {LuGraduationCap, LuUser2, LuUsers, LuBoxes, LuList} from 'react-icons/lu';
import useApi from "./useApi";

export type ModuleData = {
    icon: any;
    submodules: SubModuleData[],
    title: string,
    baseUri: string,
    requiredRoles: string[]
}

export type SubModuleData = {
    icon: any,
    title: string,
    uri: string,
    requiredRoles: string[]
}

const useModules = () => {
    const {authApi} = useApi();
    const [availableModules, setAvailableModules] = useState<ModuleData[]>([]);

    const [modules] = useState<ModuleData[]>([
        {
            title: 'routes.personal.name',
            icon: <LuUser2 size={26} color="white" />,
            submodules: [
                {
                    title: 'routes.personal.profiles.name',
                    icon: <LuUsers />,
                    uri: '/profiles',
                    requiredRoles: ['ROLE_PERSONAL_PROFILE_ACCESS']
                },
                {
                    title: 'routes.personal.roles.name',
                    icon: <LuGraduationCap />,
                    uri: '/roles',
                    requiredRoles: ['ROLE_PERSONAL_ROLE_ACCESS']
                }
            ],
            baseUri: '/personal',
            requiredRoles: ['ROLE_MODULE_PERSONAL']
        },
        {
            title: 'routes.project.name',
            icon: <LuBoxes size={26} color='white' />,
            baseUri: '/project',
            requiredRoles: ['ROLE_MODULE_PROJECT'],
            submodules: [
                {
                    title: "routes.project.list.name",
                    uri: '/list',
                    requiredRoles: ['ROLE_PROJECT_PROJECT_ACCESS'],
                    icon: <LuList />
                },
                {
                    title: "routes.project.team.name",
                    uri: '/team',
                    requiredRoles: ['ROLE_PROJECT_TEAM_ACCESS'],
                    icon: <LuUsers />
                }
            ]
        }
    ])

    useEffect(() => {
        const init = async () => {
            let required: string[] = [];
            for(const module of modules) {
                required = [...required, ...module.requiredRoles];
                for(const submodule of module.submodules) {
                    required = [...required, ...submodule.requiredRoles];
                }
            }

            const permissions = (await authApi.requirePermissions([...new Set(required)])).data;

            const filtered = modules.filter(module => module.requiredRoles.every(role => permissions.includes(role))).map(module => {
                const availableSubModules: SubModuleData[] = [];
                for(const submodule of module.submodules) {
                    if(submodule.requiredRoles.every(role => permissions.includes(role)))
                        availableSubModules.push(submodule);
                }

                return {...module, submodules: availableSubModules};
            });

            setAvailableModules(filtered);
        }
        init();
    }, [modules])

    return availableModules;
}

export default useModules;