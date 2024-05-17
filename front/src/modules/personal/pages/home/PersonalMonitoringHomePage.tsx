import React, { useEffect} from "react"
import useApi from "../../../../hooks/useApi";
import MenuBar from "../../../../components/MenuBar/MenuBar";
import './personalMonitoringHomePage.scss'
import { useTranslation } from "react-i18next";
import PersonalForm from "../../forms/PersonalForm/PersonalForm";
import ToggleDialog from "../../../../components/dialogs/toggles/toggleDialog/ToggleDialog";
import AccessControlledLayout from "../../../../components/layouts/authLayouts/AccessControlledLayout";
import ProfileList from "../../components/ProfileList/ProfileList";
import usePermissions from "../../../../hooks/usePermissions";
import { useDispatch } from "react-redux";
import { setProfiles } from "../../../../store/slices/personalSlice";
import { LuPlus } from "react-icons/lu";
import { QueryContext, QueryContextProvider } from "../../../../contexts/QueryContext";
import QueryContextLayout from "../../../../components/layouts/QueryContextLayout/QueryContextLayout";
import AccessControlledComponent from "../../../../components/accessControledComponent/AccessControlledComponent";

const PersonalMonitoringHomePage = () => {
    const {personalApi} = useApi();
    const {t} = useTranslation();
    const {requirePermissions} = usePermissions();

    useEffect(() => {
        const init = async () => {
            await requirePermissions(['ROLE_PERSONAL_PROFILE']);
        }
        init();
    }, [])

    return (
        <AccessControlledLayout roles={['ROLE_MODULE_PERSONAL']}>
            <MenuBar>
                <div></div>
                <div className="menuBar-content">
                    <AccessControlledComponent roles={['ROLE_PERSONAL_PROFILE_CREATE']}>
                        <ToggleDialog title={t('personal.createProfile.title')} isModal={false} icon={<LuPlus />}>
                            <PersonalForm />
                        </ToggleDialog>
                    </AccessControlledComponent>
                </div>
            </MenuBar>
            <QueryContextLayout apiFetchCallback={personalApi.getList} defaultSortSetting={{field: 'lastName', sort: 'ASC'}}>
                <ProfileList />
            </QueryContextLayout>         
        </AccessControlledLayout>
        
    )
}

export default PersonalMonitoringHomePage;