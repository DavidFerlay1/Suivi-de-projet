<?php

namespace App\Listeners;

use App\Entity\Main\Account;
use App\Entity\Tenant\AccountRoleProfiles;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class OnAccountRoleProfilePersist implements EventSubscriber {

    public function __construct(private EntityManagerInterface $mainEm)
    {
        
    }

    public function getSubscribedEvents()
    {
        return [
            Events::postPersist,
            Events::postUpdate
        ];
    }

    public function process(LifecycleEventArgs $args) {
        $entity = $args->getObject();

        if(!$entity instanceof AccountRoleProfiles)
            return;

        /** @var \App\Entity\Tenant\AccountRoleProfiles $entity */
        $qb = $this->mainEm->getRepository(Account::class)->createQueryBuilder('account');
        $qb->update(Account::class, 'account')
            ->where('account.id = :accountId')->setParameter('accountId', $entity->getAccountId())
            ->set('account.roles', ':roles')->setParameter('roles', json_encode(array_unique(array_merge(...array_map(fn($roleProfile) => $roleProfile->getRoles(), $entity->getRoleProfiles()->toArray())))))
            ->getQuery()->execute();
    }

    public function postPersist(PostPersistEventArgs $args) {
        $this->process($args);
    }

    public function postUpdate(PostUpdateEventArgs $args) {
        $this->process($args);
    }
}