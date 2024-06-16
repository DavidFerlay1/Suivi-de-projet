import React, { useContext, useEffect, useState } from 'react';
import { RoleProfile } from '@interfaces/Personal';
import './roleProfileList.scss';
import Paginator from '@components/navigation/Paginator/Paginator';
import { QueryContext } from '@contexts/QueryContext';
import Sorter from '@components/queryFilters/Sorter';
import RoleProfileItem from './RoleProfileItem/RoleProfileItem';
import AccessControlledComponent from '@components/layouts/security/AccessControlledComponent'
import Dialog from '@components/dialogs/dialog/Dialog'
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '@components/dialogs/confirmDialog/ConfirmDialog';
import useApi from '@hooks/useApi';
import MenuBar from '@components/MenuBar/MenuBar';
import Searchbar from '@components/searchbar/Searchbar';
import { LuPlus } from 'react-icons/lu';
import RoleProfileForm from '@components/Form/forms/RoleProfileForm/RoleProfileForm';
import { toast } from 'react-toastify';
import RoleProfileFilters from '@components/filters/RoleProfileFilters/RoleProfileFilters';

// type RoleProfileItemProps = {
//     roleProfile: RoleProfile
// }

const RoleProfileList = () => {

    const [roleProfiles, setRoleProfiles] = useState<RoleProfile[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [targetRoleProfile, setTargetRoleProfile] = useState<undefined|RoleProfile>();
    const {t} = useTranslation();
    const {personalApi} = useApi();

    const queryContext = useContext(QueryContext);

    useEffect(() => {
        queryContext?.fetch().then((res: RoleProfile[]) => {
            setRoleProfiles(res);
        })
    }, [queryContext?.params])

    const onRoleProfileDeleteClick = (roleProfile: RoleProfile) => {
        setTargetRoleProfile(roleProfile);
        setDeleteDialogOpen(true);
    }

    const onRoleProfileEditClick = async (roleProfile: RoleProfile) => {
        roleProfile.roles = (await personalApi.fetchRoleProfileRoles(roleProfile)).data; 
        setTargetRoleProfile(roleProfile);
        setEditDialogOpen(true);
    }

    const deleteRoleProfile = async () => {
        if(targetRoleProfile && targetRoleProfile.id) {
            await personalApi.deleteRoleProfile(targetRoleProfile.id);
            const refreshedList = await queryContext?.fetch();
            setRoleProfiles(refreshedList);
            toast(t('roleProfile.deleteSuccess'), {type: 'success'});
        }

    }

    const renderSearchbarItem = (item: RoleProfile) => {
        return <RoleProfileItem onDeleteClick={onRoleProfileEditClick} onEditClick={onRoleProfileEditClick} roleProfile={item} />
    }

    const afterCreateEditRoleProfile = () => {
        queryContext?.fetch().then((roleProfiles: RoleProfile[]) => {
            setRoleProfiles(roleProfiles);
            setEditDialogOpen(false);
            toast(t(`roleProfile.${targetRoleProfile?.id ? 'edit' : 'create'}Success`), {type: 'success'});
            setTargetRoleProfile({name: '', roles: []});
        })
    }

    const onCreateProfileOpen = () => {
        setTargetRoleProfile({
            name: '',
            roles: []
        });
        setEditDialogOpen(true);
    }

    return (
        <AccessControlledComponent roles={['ROLE_PERSONAL_ROLE_ACCESS']}>
            <MenuBar>
                <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                    <Searchbar renderItem={renderSearchbarItem} />
                    <RoleProfileFilters />
                </div>
                <div>
                    <span>Tri par nom</span>
                    <Sorter field="name" />
                </div>
                <button onClick={onCreateProfileOpen}><LuPlus /> {t('roleProfile.createTitle')}</button>
            </MenuBar>
            <div className='roleList'>
                {roleProfiles.map(roleProfile => <RoleProfileItem onDeleteClick={onRoleProfileDeleteClick} onEditClick={onRoleProfileEditClick} roleProfile={roleProfile} />)}
            </div>
            <Paginator />
            <AccessControlledComponent roles={['ROLE_PERSONAL_ROLE_EDIT']}>
                <Dialog className='huge' title={targetRoleProfile && targetRoleProfile.id ? targetRoleProfile.name : t('roleProfile.createTitle')} isModal={true} setIsOpen={setEditDialogOpen} isOpen={editDialogOpen}>
                    <RoleProfileForm onSuccess={afterCreateEditRoleProfile} profile={targetRoleProfile} />
                </Dialog>
            </AccessControlledComponent>
            <AccessControlledComponent roles={['ROLE_PERSONAL_ROLE_DELETE']}>
                <ConfirmDialog onConfirm={deleteRoleProfile} title={t('roleProfile.deleteTitle')} isModal={false} isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen}>
                    <p>{t('roleProfile.deleteConfirm1')} <span style={{fontWeight: 'bold'}}>{targetRoleProfile?.name}</span> ?<br/><br/><span className='alert'>{t('roleProfile.deleteConfirm2')}</span></p>
                </ConfirmDialog>
            </AccessControlledComponent>
        </AccessControlledComponent>
    )
}

export default RoleProfileList;