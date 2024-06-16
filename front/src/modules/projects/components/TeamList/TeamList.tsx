import React, { useCallback, useContext, useEffect, useState } from "react"
import MenuBar from "@components/MenuBar/MenuBar"
import Dialog from "@components/dialogs/dialog/Dialog"
import { Team } from "@interfaces/Team";
import TeamForm from "@components/Form/forms/TeamForm";
import { QueryContext } from "@contexts/QueryContext";
import Paginator from '@components/navigation/Paginator/Paginator'
import TeamItem from "../TeamItem/TeamItem";
import "./teamList.scss"
import ConfirmDialog from "@components/dialogs/confirmDialog/ConfirmDialog";
import useApi from "@hooks/useApi";
import { useTranslation } from "react-i18next";
import Searchbar from '@components/searchbar/Searchbar'
import QueryContextLayout from "@components/layouts/QueryContextLayout/QueryContextLayout";

const TeamList = () => {

    const queryContext = useContext(QueryContext);
    const {teamApi} = useApi();
    const {t} = useTranslation();

    const [teams, setTeams] = useState<Team[]>([]);
    const [editPopupDialogOpen, setEditPopupDialogOpen] = useState(false);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [targetTeam, setTargetTeam] = useState<Team>({
        name: '',
        members: []
    })

    const fetchData = useCallback(() => {
        queryContext?.fetch().then((data: Team[]) => {
            setTeams(data);
        })
    }, [queryContext?.params])

    useEffect(() => {
        fetchData();
    }, [queryContext?.params])

    const resetTarget = () => {
        setTargetTeam({
            name: '',
            members: []
        })
    }

    const onCreateEditSuccess = () => {
        setEditPopupDialogOpen(false);
        fetchData();
    }

    const onEditClick = (team: Team) => {
        setTargetTeam(team);
        setEditPopupDialogOpen(true);
    }

    const onDeleteClick = (team: Team) => {
        setTargetTeam(team);
        setDeletePopupOpen(true);
    }

    const onDeleteConfirm = async () => {
        await teamApi.delete(targetTeam);
        setTeams(await queryContext?.fetch());
        setDeletePopupOpen(false);
        resetTarget();
    }   

    const renderSearchItem = (team: Team) => {
        return <TeamItem team={team} onEdit={onEditClick} onDelete={onDeleteClick} />
    }

    return (
        <div>
            <MenuBar>
                <QueryContextLayout defaultSortSetting={{field: 'name', sort: 'ASC'}} apiFetchCallback={teamApi.getList}>
                    <Searchbar renderItem={renderSearchItem} />
                </QueryContextLayout>
                
                <button onClick={() => setEditPopupDialogOpen(true)}>CREATE</button>
            </MenuBar>
            <div>
                <Dialog beforeClose={resetTarget} title="create" isModal={true} isOpen={editPopupDialogOpen} setIsOpen={setEditPopupDialogOpen}>
                    <TeamForm onSuccess={onCreateEditSuccess} value={targetTeam} />
                </Dialog>
                <ConfirmDialog isModal={false} title={t('team.delete')} isOpen={deletePopupOpen} setIsOpen={setDeletePopupOpen} onConfirm={onDeleteConfirm}>
                    <p>SURE TO DELETE TA MERE ?</p>
                </ConfirmDialog>
            </div>

            <ul className="teamList">
                {teams.map(team => (
                    <li key={team.id}>
                        <TeamItem onDelete={onDeleteClick} onEdit={onEditClick} team={team} />
                    </li>
                ))}
            </ul>
            <Paginator />
        </div>
    )
}

export default TeamList;