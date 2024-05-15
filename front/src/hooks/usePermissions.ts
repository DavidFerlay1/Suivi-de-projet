import { useCallback, useEffect } from "react"
import useApi from "./useApi";
import { useDispatch, useSelector } from "react-redux";
import { initPermissions, revokePermissions } from "src/store/slices/userSlice";
import { useLocation } from "react-router";


const usePermissions = () => {

    const {authApi} = useApi();
    const dispatch = useDispatch();
    const {ready, data} = useSelector((state: any) => state.user.permissions);
    const location = useLocation();

    const requirePermissions = useCallback(async (roles: string[]) => {
        const mapped = [];
        const perms = ['EDIT', 'ACCESS', 'DELETE'];

        for(const role of roles) {
            for(const perm of perms)
                mapped.push(`${role}_${perm}`);
        }

        try {
            dispatch(initPermissions((await authApi.requirePermissions(mapped)).data));
        } catch(e) {
            console.log(e)
        }
        
    }, [data]);

    const hasPermissions = useCallback((permissions: string[]|string) => {
        if(typeof permissions === 'string')
            return permissions.includes(permissions);

        for(const permission of permissions) {
            if(!permission.includes(permission))
                return false;
        }
        
        return true;

    }, [data, ready]);

    return {
        hasPermissions,
        permissionsReady: ready,
        requirePermissions
    }
}

export default usePermissions;