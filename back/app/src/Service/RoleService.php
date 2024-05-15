<?php

namespace App\Service;

use App\Entity\Main\Account;
use App\Entity\Tenant\RoleProfile;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Parameter;
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
        $profiles = $this->em->getRepository(RoleProfile::class)->findBy(['id' => $account->getRoleProfileIds()]);
            
        $roles = ['ROLE_USER'];
        foreach($profiles as $profile) {
            $roles = array_merge($roles, $profile->getRoles());
        }

        $account->setRoles($roles);
    }

    public function deleteRoleProfile(RoleProfile $roleProfile) {
        $id = $roleProfile->getId();
        $qb = $this->mainEm->getRepository(Account::class)->createQueryBuilder('a');
        $accounts= $qb->where($qb->expr()->in(':profile_id', 'a.roleProfiles'))
                        ->andWhere('a.tenant = :tenant')
                        ->setParameters(new ArrayCollection([
                            new Parameter('profile_id', $id),
                            new Parameter('tenant', $this->tokenStorage->getToken()->getUser()->getTenant())
                        ]))
                        ->getQuery()->getResult();
        

        foreach($accounts as $account) {
            $account->removeProfileId($id);
            $this->mainEm->persist($account);
        }

        $this->mainEm->flush();

        $this->em->remove($roleProfile);
        $this->em->flush();
    }

    public function getRoles() {
        return $this->roles;
    }

    public function getRoleProfiles() {
        return $this->em->getRepository(RoleProfile::class)->findAll();
    }
}