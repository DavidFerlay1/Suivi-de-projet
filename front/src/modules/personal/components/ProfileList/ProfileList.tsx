import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import './profileList.scss'
import { Personal, SubmittablePersonal } from "../../../../interfaces/Personal";
import AccessControlledComponent from "../../../../components/accessControledComponent/AccessControlledComponent";
import {LuGraduationCap, LuPencil, LuTrash2, LuUserPlus} from 'react-icons/lu'
import useApi from "../../../../hooks/useApi";
import ConfirmDialog from "../../../../components/dialogs/confirmDialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import Dialog from "../../../../components/dialogs/dialog/Dialog";
import PersonalForm from "../../forms/PersonalForm/PersonalForm";
import { useDispatch, useSelector } from "react-redux";
import {setProfiles} from '../../../../store/slices/personalSlice';
import Sorter from "../../../../components/queryFilters/Sorter";


const ProfileList = () => {

    const [editingProfile, setEditingProfile] = useState<SubmittablePersonal|undefined>();
    const [deletingProfile, setDeletingProfile] = useState<SubmittablePersonal|undefined>();
    const [isEditingPopupOpen, setIsEditingPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const {personalApi} = useApi();
    const {t} = useTranslation();
    const profiles = useSelector((state: any) => state.personal.profiles);
    const dispatch = useDispatch();

    const onDeleteConfirm = useCallback(() => {
        if(deletingProfile) {
            personalApi.delete(deletingProfile.id!).then(() => {
                dispatch(setProfiles([...profiles.filter(({id}) => id !== deletingProfile.id)]))
                setDeletingProfile(undefined);
            }).catch(e => console.log(e));
        }
    }, [deletingProfile, profiles])

    const onEditClick = (profile: SubmittablePersonal) => {
        setEditingProfile(profile);
        setIsEditingPopupOpen(true);
    }

    const closePopupAfterEditing = () => {
        setIsEditingPopupOpen(false);
        setEditingProfile(undefined);
    }

    const onDeleteClick = (profile: SubmittablePersonal) => {
        setDeletingProfile(profile);
        setIsDeletePopupOpen(true);
    }

    const onDeleteCancel = () => {
        setIsDeletePopupOpen(false);
        setDeletingProfile(undefined);
    }

    return profiles && (
        <>
            <table className="profileList">
                <thead>
                    <tr>
                        <th>Nom<Sorter field='lastName' /></th>
                        <th>Prénom<Sorter field='firstname' /></th>
                        <th>Email<Sorter field='username' /></th>
                        <th>Etat<Sorter field='hasAccount' /></th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map((profile, index) => (
                        <tr className={index % 2 === 0 ? 'even' : ''} onKeyDown={profile.id} key={profile.id}>
                            <td>{profile.lastName}</td>
                            <td>{profile.firstname}</td>
                            <td>{profile.username}</td>
                            <td>{profile.hasAccount ? t('personal.active') : t('personal.noAccount')}</td>
                            <td><ActionList onDelete={onDeleteClick} onEdit={onEditClick} profile={profile} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Dialog title={t('personal.editProfile.title')} isModal={true} isOpen={isEditingPopupOpen} setIsOpen={setIsEditingPopupOpen}>
                <PersonalForm handleParentPopupEndEvent={closePopupAfterEditing} target={editingProfile} />
            </Dialog>
            <ConfirmDialog isModal={true} title={t('personal.deleteProfile.title')} onCancel={onDeleteCancel} onConfirm={onDeleteConfirm} isOpen={isDeletePopupOpen} setIsOpen={setIsDeletePopupOpen}>
                <span>{t('personal.deleteProfile.confirmMessage')} {deletingProfile?.firstname} {deletingProfile?.lastName} ?</span>
            </ConfirmDialog>
        </>
        
    )
}

type ActionListProps = {
    profile: Personal,
    onDelete: Function,
    onEdit: Function,
    onRoleEdit?: Function
}

const ActionList = ({profile, onEdit, onDelete}: ActionListProps) => {
    return (
        <>
            <ul>
                <AccessControlledComponent roles={['ROLE_PERSONAL_PROFILE_EDIT']}>
                    <li><button className="icon-button" onClick={() => onEdit(profile)} ><LuPencil /></button></li>
                </AccessControlledComponent>
                
                {!profile.hasAccount && (
                    <AccessControlledComponent roles={['ROLE_PERSONAL_PROFILE_EDIT']}>
                        <li><button className="icon-button" ><LuUserPlus /></button></li>
                    </AccessControlledComponent>
                    
                )}
                <AccessControlledComponent roles={['ROLE_PERSONAL_PROFILE_DELETE']}>
                    <li><button className="icon-button danger" onClick={() => onDelete(profile)}><LuTrash2 /></button></li>
                </AccessControlledComponent>
            </ul>
        </>
    )
}

export default ProfileList;