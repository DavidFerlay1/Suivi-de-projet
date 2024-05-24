<?php

namespace App\Listeners;

use App\Entity\Main\Account;
use App\Entity\Tenant\AccountRoleProfiles;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\PreRemoveEventArgs;
use Doctrine\ORM\Events;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;

class OnAccountDeleteSubscriber implements EventSubscriber {
    public function __construct(private TenantEntityManager $em) {}

    public function getSubscribedEvents()
    {
        return [
            Events::preRemove
        ];
    }

    public function preRemove(PreRemoveEventArgs $args) {
        $entity = $args->getObject();

        if(!$entity instanceof Account)
            return;

        $roleProfileSet = $this->em->getRepository(AccountRoleProfiles::class)->findOneBy(['accountId' => $entity->getId()]);
        if($roleProfileSet) {
            $this->em->remove($roleProfileSet);
            $this->em->flush();
        }
    }
}

