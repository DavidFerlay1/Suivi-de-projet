<?php

namespace App\Listeners;

use App\Entity\Main\Account;
use App\Entity\Tenant\Team;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostLoadEventArgs;
use Doctrine\ORM\Events;

class OnTeamLoad implements EventSubscriber {

    public function __construct(private EntityManagerInterface $mainEm)
    {
        
    }

    public function getSubscribedEvents()
    {
        return [
            Events::postLoad
        ];
    }

    public function postLoad(PostLoadEventArgs $args) {
        $entity = $args->getObject();

        if(!$entity instanceof Team)
            return;

        /** @var \App\Entity\Tenant\Team $entity */
        if(!empty($entity->getMemberIds()))
            $entity->setMembers(new ArrayCollection($this->mainEm->getRepository(Account::class)->findBy(['id' => $entity->getMemberIds()])));
        else 
            $entity->setMembers(new ArrayCollection());
    }
}