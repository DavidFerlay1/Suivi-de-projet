<?php

namespace App\Listeners;

use App\Entity\Main\Account;
use App\Entity\Tenant\AccountRoleProfiles;
use App\Entity\Tenant\RoleProfile;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Events;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Symfony\Bundle\SecurityBundle\Security;

class OnRoleProfilePersist implements EventSubscriber {

    public function __construct(private EntityManagerInterface $mainEm, private TenantEntityManager $em, private Security $security)
    {
        
    }

    public function getSubscribedEvents() {
        return [
            Events::preUpdate
        ];
    }

    protected function process(LifecycleEventArgs $args) {
        $entity = $args->getObject();
        if(!$entity instanceof RoleProfile)
            return;

        /** @var \App\Entity\Tenant\RoleProfile $entity */
        $qb = $this->em->getRepository(AccountRoleProfiles::class)->createQueryBuilder('arp');

        $arps = $qb->where($qb->expr()->isMemberOf(':roleProfile', 'arp.roleProfiles'))
                    ->setParameter('roleProfile', $entity)
                    ->getQuery()->getResult();

        if(!empty($arps)) {
            /** @var \App\Entity\Main\Account $currentUser */
            $currentUser = $this->security->getUser();

            $sql = 'UPDATE profile SET roles = CASE ';
            foreach($arps as $arp) {
                $accountId = $arp->getAccountId();
                $roles = json_encode(array_unique(array_merge(...array_map(fn($roleProfiles) => $roleProfiles->getRoles(), $arp->getRoleProfiles()->toArray()))));
                $sql .= "WHEN id = $accountId THEN '$roles' ";
            }

            $sql .= "END WHERE id IN(:ids) AND tenant_id = :tenant_id";

            $qb = $this->mainEm->createNativeQuery($sql, new ResultSetMappingBuilder($this->mainEm))
                    ->setParameter('ids', array_map(fn($arp) => $arp->getAccountId(), $arps))
                    ->setParameter('tenant_id', $currentUser->getTenant()->getId());

            $qb->execute();
        }
        
    }

    public function preUpdate(PreUpdateEventArgs $args) {
        $this->process($args);
    }
}