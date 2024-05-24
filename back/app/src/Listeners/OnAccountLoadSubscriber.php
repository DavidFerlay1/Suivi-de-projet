<?php

namespace App\Listeners;

use App\Entity\Main\Account;
use App\Entity\Tenant\AccountRoleProfiles;
use App\Service\DbService;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\PostLoadEventArgs;
use Doctrine\ORM\Events;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class OnAccountLoadSubscriber implements EventSubscriber {

    public function __construct(private TenantEntityManager $em, private DbService $dbService, private RequestStack $requestStack){}

    public function getSubscribedEvents()
    {
        return [
            Events::postLoad
        ];
    }

    public function postLoad(PostLoadEventArgs $args) {
        $entity = $args->getObject();

        if(!$entity instanceof Account)
            return;

        $this->dbService->switchTenantDb($entity->gettenant()->getid());

        $roleProfileSet = $this->em->getRepository(AccountRoleProfiles::class)->findOneBy(['accountId' => $entity->getId()]);
        
        if($roleProfileSet)
            $entity->setRoleProfiles($roleProfileSet->getRoleProfiles());
    }

}