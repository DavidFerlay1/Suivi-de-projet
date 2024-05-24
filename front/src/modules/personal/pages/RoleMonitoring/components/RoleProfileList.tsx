import React, { useContext, useEffect, useState } from 'react';
import { RoleProfile } from '../../../../../interfaces/Personal';
import './roleProfileList.scss';
import Paginator from '../../../../../components/navigation/Paginator/Paginator';
import { QueryContext } from '../../../../../contexts/QueryContext';
import Sorter from '../../../../../components/queryFilters/Sorter';
import RoleProfileItem from './RoleProfileItem/RoleProfileItem';
import AccessControlledComponent from '../../../../../components/accessControledComponent/AccessControlledComponent'
import Dialog from '../../../../../components/dialogs/dialog/Dialog'
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../../../../components/dialogs/confirmDialog/ConfirmDialog';
import useApi from '../../../../../hooks/useApi';

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
    }, [queryContext?.page, queryContext?.sortSettings])

    const onRoleProfileDeleteClick = (roleProfile: RoleProfile) => {
        setTargetRoleProfile(roleProfile);
        setDeleteDialogOpen(true);
    }

    const onRoleProfileEditClick = (roleProfiles: RoleProfile) => {

    }

    const deleteRoleProfile = () => {
        if(targetRoleProfile)
            personalApi.deleteRoleProfile(targetRoleProfile.id)
    }

    return (
        <AccessControlledComponent roles={['ROLE_PERSONAL_ROLE_ACCESS']}>
            <span>Tri par nom</span><Sorter field="name" />
            <div className='roleList'>
                {roleProfiles.map(roleProfile => <RoleProfileItem onDeleteClick={onRoleProfileDeleteClick} onEditClick={onRoleProfileEditClick} roleProfile={roleProfile} />)}
            </div>
            <Paginator />
            <AccessControlledComponent roles={['ROLE_PERSONAL_ROLE_EDIT']}>
                <Dialog title={t('roleProfile.editTitle')} isModal={true} setIsOpen={setEditDialogOpen} isOpen={editDialogOpen}>
                    Bonsoir !
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

// const RoleProfileItem = ({roleProfile}: RoleProfileItemProps) => {
//     return (
//         <li>
//             {roleProfile.name}
//             <div className='actions'>
//                 <AccessControlledComponent roles={['ROLE_PERSONAL_ROLE_EDIT']}>
//                     <li><button className="icon-button"><LuPencil /></button></li>
//                 </AccessControlledComponent>
//                 <AccessControlledComponent roles={['ROLE_PERSONAL_ROLE_DELETE']}>
//                     <li><button className="icon-button danger"><LuTrash2 /></button></li>
//                 </AccessControlledComponent>
//             </div>
//         </li>
//     )
// } 

export default RoleProfileList;