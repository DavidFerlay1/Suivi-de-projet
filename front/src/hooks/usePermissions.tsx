import { useCallback} from "react"
import useApi from "./useApi";
import { useDispatch, useSelector } from "react-redux";
import { initPermissions } from "../store/slices/userSlice"

const  usePermissions = () => {

    const {authApi} = useApi();
    const dispatch = useDispatch();
    const {ready, data} = useSelector((state: any) => state.user.permissions);

    const requirePermissions = useCallback(async (roles: string[], automap: boolean = true) => {

        if(automap) {
            const mapped: string[] = [];
            const perms = ['EDIT', 'ACCESS', 'DELETE', 'CREATE'];

            for(const role of roles) {
                for(const perm of perms)
                    mapped.push(`${role}_${perm}`);
            }

            roles = mapped;
        }

        try {
            dispatch(initPermissions((await authApi.requirePermissions(roles)).data));
        } catch(e) {
            console.log(e)
        }
        
    }, [data]);

    const hasPermissions = useCallback((permissions: string[]|string) => {
        if(typeof permissions === 'string')
            return permissions.includes(permissions);

        for(const permission of permissions) {
            if(!data.includes(permission))
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