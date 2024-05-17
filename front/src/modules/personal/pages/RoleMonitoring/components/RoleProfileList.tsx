import React from 'react';
import { RoleProfile } from '../../../../../interfaces/Personal';
import './roleProfileList.scss';
import AccessControlledComponent from '../../../../../components/accessControledComponent/AccessControlledComponent';
import { LuPencil, LuTrash2 } from 'react-icons/lu';

type RoleProfileListProps = {
    roleProfiles: RoleProfile[]
}

type RoleProfileItemProps = {
    roleProfile: RoleProfile
}

const RoleProfileList = ({roleProfiles}: RoleProfileListProps) => {
    return (
        <ul className='roleList'>
            {roleProfiles.map(roleProfile => <RoleProfileItem key={roleProfile.id} roleProfile={roleProfile} />)}
        </ul>
    )
}

const RoleProfileItem = ({roleProfile}: RoleProfileItemProps) => {
    return (
        <li>
            {roleProfile.name}
            <div className='actions'>
                <AccessControlledComponent roles={['ROLE_PERSONAL_ROLE_EDIT']}>
                    <li><button className="icon-button"><LuPencil /></button></li>
                </AccessControlledComponent>
                <AccessControlledComponent roles={['ROLE_PERSONAL_ROLE_DELETE']}>
                    <li><button className="icon-button danger"><LuTrash2 /></button></li>
                </AccessControlledComponent>
            </div>
        </li>
    )
} 

export default RoleProfileList;