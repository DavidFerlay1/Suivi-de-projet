<?php

namespace App\DataFixtures;

use App\Entity\Tenant\RoleProfile;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class RoleProfileFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $data = [
            [
                'name' => 'Super administrateur',
                'roles' => ['ROLE_SUPERADMIN'],
                'listable' => false,
                'settable' => false
            ],
            [
                'name' => 'Ressources humaines',
                'roles' => [
                            'ROLE_MODULE_PERSONAL',
                            'ROLE_PERSONAL_PROFILE_ACCESS', 
                            'ROLE_PERSONAL_PROFILE_CREATE', 
                            'ROLE_PERSONAL_PROFILE_EDIT', 
                            'ROLE_PERSONAL_PROFILE_DELETE',
                            'ROLE_PERSONAL_ROLE_ACCESS', 
                            'ROLE_PERSONAL_ROLE_CREATE', 
                            'ROLE_PERSONAL_ROLE_EDIT', 
                            'ROLE_PERSONAL_ROLE_DELETE',
                ],
                'settable' => true,
                'listable' => true
            ],
            [
                'name' => 'Chef de projet',
                'roles' => [
                    'ROLE_MODULE_PROJECT',
                    'ROLE_PROJECT_PROJECT_CREATE', 
                    'ROLE_PROJECT_PROJECT_ACCESS', 
                    'ROLE_PROJECT_PROJECT_EDIT', 
                    'ROLE_PROJECT_PROJECT_DELETE',
                    'ROLE_PROJECT_TASK_CREATE', 
                    'ROLE_PROJECT_TASK_ACCESS', 
                    'ROLE_PROJECT_TASK_EDIT', 
                    'ROLE_PROJECT_TASK_DELETE',
                    'ROLE_PROJECT_TEAM_CREATE', 
                    'ROLE_PROJECT_TEAM_ACCESS', 
                    'ROLE_PROJECT_TEAM_EDIT', 
                    'ROLE_PROJECT_TEAM_DELETE',
                ],
                'settable' => true,
                'listable' => true
            ],
            [
                'name' => 'Administrateur projet',
                'roles' => [
                    'ROLE_MODULE_PROJECT',
                    'ROLE_PROJECT_PROJECT_ACCESS',
                    'ROLE_PROJECT_TASK_ACCESS',
                    'ROLE_PROJECT_TASK_CREATE',
                    'ROLE_PROJECT_TASK_EDIT', 
                    'ROLE_PROJECT_TASK_DELETE',
                    'ROLE_PROJECT_TEAM_ACCESS', 
                    'ROLE_PROJECT_TEAM_EDIT', 
                ],
                'settable' => true,
                'listable' => true
            ],
            [
                'name' => 'Contributeur projet',
                'roles' => [
                    'ROLE_MODULE_PROJECT',
                    'ROLE_PROJECT_PROJECT_ACCESS',
                    'ROLE_PROJECT_TASK_ACCESS',
                    'ROLE_PROJECT_TASK_EDIT', 
                ],
                'settable' => true,
                'listable' => true
            ],
            [
                'name' => 'Import CSV',
                'roles' => [],
                'settable' => false,
                'listable' => true
            ]
        ];

        foreach($data as $d) {
            $manager->persist((new RoleProfile())->setName($d['name'])->setRoles($d['roles'])->setImmutable(true)->setListable($d['listable'])->setSettable($d['settable']));
        }

        $manager->flush();
    }
}
