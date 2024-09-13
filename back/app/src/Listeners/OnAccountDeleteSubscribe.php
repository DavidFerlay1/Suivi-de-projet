<?php

namespace App\Listeners;

use App\Entity\Main\Account;
use App\Entity\Tenant\AccountRoleProfiles;
use App\Entity\Tenant\CalendarEventInvitation;
use App\Entity\Tenant\Notification;
use App\Entity\Tenant\Team;
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
        $qb = $this->em->getRepository(Team::class)->createQueryBuilder('team');
        $qb->where($qb->expr()->in(':accountId', 'team.memberIds'))->setParameter('accountId', $entity->getId());

        foreach($qb->getQuery()->getResult() as $team) {
            $team->removeMemberId($entity->getId());
            $this->em->persist($team);
        }

        if($roleProfileSet) {
            $this->em->remove($roleProfileSet);
        }

        $this->em->createQueryBuilder()->delete(CalendarEventInvitation::class, 'cei')
            ->where('cei.memberId = :userId')
            ->setParameter('userId', $entity->getId())
            ->getQuery()
            ->execute();

        $this->em->createQueryBuilder()->delete(Notification::class, 'n')
            ->where('n.recipientId = :userId')
            ->setParameter('userId', $entity->getId())
            ->getQuery()
            ->execute();

        $this->em->flush();
    }
}

