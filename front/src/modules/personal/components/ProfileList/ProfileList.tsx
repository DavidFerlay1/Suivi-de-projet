import React, { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useState } from "react";
import './profileList.scss'
import { Personal, SubmittablePersonal } from "../../../../interfaces/Personal";
import AccessControlledComponent from "../../../../components/accessControledComponent/AccessControlledComponent";
import {LuGraduationCap, LuPencil, LuPlus, LuTrash2, LuUserPlus} from 'react-icons/lu'
import useApi from "../../../../hooks/useApi";
import ConfirmDialog from "../../../../components/dialogs/confirmDialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import Dialog from "../../../../components/dialogs/dialog/Dialog";
import PersonalForm from "../../forms/PersonalForm/PersonalForm";
import Sorter from "../../../../components/queryFilters/Sorter";
import { PaginationContext } from "../../../../contexts/PaginationContext";
import { SortContext } from "../../../../contexts/SortContext";
import { QueryContext } from "../../../../contexts/QueryContext";
import Paginator from "../../../../components/navigation/Paginator/Paginator";
import { ToastContainer, toast } from 'react-toastify';
import MenuBar from "../../../../components/MenuBar/MenuBar";
import ToggleDialog from "../../../../components/dialogs/toggles/toggleDialog/ToggleDialog";
import QueryContextLayout from "../../../../components/layouts/QueryContextLayout/QueryContextLayout";
import Searchbar from "../../../../components/searchbar/Searchbar";


const ProfileList = () => {

    const [editingProfile, setEditingProfile] = useState<SubmittablePersonal|undefined>();
    const [deletingProfile, setDeletingProfile] = useState<SubmittablePersonal|undefined>();
    const [isEditingPopupOpen, setIsEditingPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const {personalApi} = useApi();
    const {t} = useTranslation();
    const [profiles, setProfiles] = useState<SubmittablePersonal[]>([]);

    const paginationContext = useContext(PaginationContext);
    const sortContext = useContext(SortContext);
    const queryContext = useContext(QueryContext);

    useEffect(() => {
        queryContext?.fetch().then((profiles: SubmittablePersonal[]) => {
            setProfiles(profiles);
        })
    }, [paginationContext?.page, sortContext?.current])

    const onDeleteConfirm = useCallback(async () => {
        if(deletingProfile) {
            await personalApi.delete(deletingProfile.id!);
            queryContext?.fetch().then(res => setProfiles(res));
            setIsDeletePopupOpen(false);
        }
    }, [deletingProfile, profiles])

    const onEditClick = (profile: SubmittablePersonal) => {
        setEditingProfile(profile);
        setIsEditingPopupOpen(true);
    }

    const handleParentPopupEndEvent = () => {
        queryContext?.fetch().then((profiles: SubmittablePersonal[]) => {
            setProfiles(profiles);
            setIsEditingPopupOpen(false);
            toast(`${editingProfile?.createAccount ? 'Création de compte' : editingProfile?.id ? 'Edition' : 'Création'} terminée`, {type: 'success'});
            setEditingProfile(undefined);
        })
    }

    const onCreateClick = () => {
        setEditingProfile({
            lastName: '',
            firstname: '',
            username: '',
            createAccount: false,
            roleProfiles: [],
            hasAccount: false
        });
        setIsEditingPopupOpen(true);
    }

    const onDeleteClick = (profile: SubmittablePersonal) => {
        setDeletingProfile(profile);
        setIsDeletePopupOpen(true);
    }

    const onDeleteCancel = () => {
        setIsDeletePopupOpen(false);
        setDeletingProfile(undefined);
    }

    const searchItem = (result: SubmittablePersonal) => {
        return (
            <div className="suggestion">
                <span>{result.lastName} {result.firstname}</span>
                <ActionList profile={result} onDelete={onDeleteClick} onEdit={onEditClick} />
            </div>
        )
    }

    return profiles && (
        <>
            <MenuBar>
                <QueryContextLayout defaultSortSetting={{field: 'lastName', sort: 'ASC'}} apiFetchCallback={personalApi.getList}>
                    <Searchbar renderItem={searchItem} />
                </QueryContextLayout>
                <div className="menuBar-content">
                    <AccessControlledComponent roles={['ROLE_PERSONAL_PROFILE_CREATE']}>
                        <button onClick={onCreateClick}><LuPlus/>{t('personal.createProfile.title')}</button>
                    </AccessControlledComponent>
                </div>
            </MenuBar>
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
                        <tr className={index % 2 === 0 ? 'even' : ''} key={profile.id}>
                            <td>{profile.lastName}</td>
                            <td>{profile.firstname}</td>
                            <td>{profile.username}</td>
                            <td className={profile.hasAccount ? 'isActive' : 'noProfile'}>{profile.hasAccount ? t('personal.active') : t('personal.noAccount')}</td>
                            <td><ActionList onDelete={onDeleteClick} onEdit={onEditClick} profile={profile} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Paginator />
            <Dialog title={t('personal.editProfile.title')} isModal={true} isOpen={isEditingPopupOpen} setIsOpen={setIsEditingPopupOpen}>
                <PersonalForm handleParentPopupEndEvent={handleParentPopupEndEvent} target={editingProfile} />
            </Dialog>
            <ConfirmDialog isModal={true} title={t('personal.deleteProfile.title')} onCancel={onDeleteCancel} onConfirm={onDeleteConfirm} isOpen={isDeletePopupOpen} setIsOpen={setIsDeletePopupOpen}>
                <span>{t('personal.deleteProfile.confirmMessage')} {deletingProfile?.firstname} {deletingProfile?.lastName} ?</span>
            </ConfirmDialog>
        </>
        
    )
}

type ActionListProps = {
    profile: SubmittablePersonal,
    onDelete: Function,
    onEdit: Function,
    onRoleEdit?: Function,
}

const ActionList = ({profile, onEdit, onDelete}: ActionListProps) => {
    return (
        <>
            <ul className="actions">
                <AccessControlledComponent roles={['ROLE_PERSONAL_PROFILE_EDIT']}>
                    <li><button className="icon-button" onClick={() => onEdit(profile)} ><LuPencil /></button></li>
                </AccessControlledComponent>
                
                <AccessControlledComponent roles={['ROLE_PERSONAL_PROFILE_DELETE']}>
                    <li><button className="icon-button danger" onClick={() => onDelete(profile)}><LuTrash2 /></button></li>
                </AccessControlledComponent>
            </ul>
        </>
    )
}

export default ProfileList;