import React, { useState } from "react"
import MenuBar from "../../../../components/MenuBar/MenuBar"
import Dialog from "../../../../components/dialogs/dialog/Dialog"
import { Team } from "../../../../interfaces/Team";
import TeamForm from "../../../../components/forms/TeamForm";

const TeamList = () => {

    const [editPopupDialogOpen, setEditPopupDialogOpen] = useState(false);
    const [targetTeam, setTargetTeam] = useState<Team>({
        name: '',
        members: []
    })

    const resetTarget = () => {
        setTargetTeam({
            name: '',
            members: []
        })
    }

    return (
        <div>
            <MenuBar>
                <button onClick={() => setEditPopupDialogOpen(true)}>CREATE</button>
            </MenuBar>
            <div>
                <Dialog title="create" isModal={true} isOpen={editPopupDialogOpen} setIsOpen={setEditPopupDialogOpen}>
                    <TeamForm value={targetTeam} />
                </Dialog>
            </div>
        </div>
    )
}

export default TeamList;