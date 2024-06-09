<?php

namespace App\Service;

use App\Entity\Main\Account;
use App\Entity\Tenant\AccountRoleProfiles;
use App\Entity\Tenant\RoleProfile;
use Doctrine\ORM\EntityManagerInterface;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class RoleService {

    private $roles = [];

    public function __construct(private ParameterBagInterface $params, private TenantEntityManager $em, private EntityManagerInterface $mainEm, private TokenStorageInterface $tokenStorage)
    {
        $this->roles = $this->params->get('role_list');
    }

    public function initRoles(Account $account) {

        $roleProfiles = $this->getAccountRoleProfiles($account);
        $account->setRoleProfiles($roleProfiles);
    }

    public function deleteRoleProfile(RoleProfile $roleProfile) {
        $qb = $this->em->getRepository(AccountRoleProfiles::class)->createQueryBuilder('entity');

        $accountRoleProfiles = $qb->where($qb->expr()->in(':targetRoleProfile', 'entity.roleProfiles'))
                                    ->setParameter('targetRoleProfile', $roleProfile)
                                    ->getQuery()->getResult();
                          
        foreach($accountRoleProfiles as $accountRoleProfile) {
            $accountRoleProfile->removeRoleProfile($roleProfile);
            $this->em->persist($accountRoleProfile);
        }

        $this->em->flush();
    }

    public function getRoles() {
        return $this->roles;
    }

    public function getRoleProfiles() {
        return $this->em->getRepository(RoleProfile::class)->findAll();
    }

    public function getAccountRoleProfiles(Account $account) {
        $roleSet = $this->em->getRepository(AccountRoleProfiles::class)->findOneBy(['accountId' => $account->getId()]);
        if(!$roleSet)
            return [];

        return $roleSet->getRoleProfiles();
    }
}