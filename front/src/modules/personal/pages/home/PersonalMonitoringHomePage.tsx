import React, { useEffect} from "react"
import useApi from "../../../../hooks/useApi";
import MenuBar from "../../../../components/MenuBar/MenuBar";
import './personalMonitoringHomePage.scss'
import { useTranslation } from "react-i18next";
import PersonalForm from "../../forms/PersonalForm/PersonalForm";
import RoleProfileForm from "../../forms/PersonalForm/RoleProfileForm/RoleProfileForm";
import ToggleDialog from "../../../../components/dialogs/toggles/toggleDialog/ToggleDialog";
import AccessControlledLayout from "../../../../components/layouts/authLayouts/AccessControlledLayout";
import ProfileList from "../../components/ProfileList/ProfileList";
import usePermissions from "../../../../hooks/usePermissions";
import { useDispatch } from "react-redux";
import { setProfiles } from "../../../../store/slices/personalSlice";
import { LuPlus } from "react-icons/lu";

const PersonalMonitoringHomePage = () => {
    const dispatch = useDispatch();
    const {personalApi} = useApi();
    const {t} = useTranslation();
    const {requirePermissions} = usePermissions();

    useEffect(() => {
        const init = async () => {
            await requirePermissions(['ROLE_PERONAL_PROFILE']);
            try {
                dispatch(setProfiles(((await personalApi.getAll()).data)));
            } catch (e) {
                console.log(e);
            }
        }

        init();
    }, [])

    return (
        <AccessControlledLayout roles={['ROLE_MODULE_PERSONAL']}>
            <MenuBar>
                <div></div>
                <div className="menuBar-content">
                    <ToggleDialog title="Ajouter un personnel" isModal={false} icon={<LuPlus />}>
                        <PersonalForm />
                    </ToggleDialog>
                    <ToggleDialog title="Gestion des rôles" isModal={false}>
                        <RoleProfileForm />
                    </ToggleDialog>
                </div>
            </MenuBar>
            <ProfileList />
        </AccessControlledLayout>
        
    )
}

export default PersonalMonitoringHomePage;