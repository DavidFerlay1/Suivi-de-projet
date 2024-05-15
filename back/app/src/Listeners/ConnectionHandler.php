<?php

namespace App\Listeners;

use App\Service\DbService;
use App\Service\RoleService;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\AuthenticationEvents;
use Symfony\Component\Security\Core\Event\AuthenticationSuccessEvent as EventAuthenticationSuccessEvent;

class ConnectionHandler implements EventSubscriberInterface {

    public function __construct(private DbService $dbService, private RoleService $roleService, private TenantEntityManager $em) {

    }

    public static function getSubscribedEvents()
    {
        return [
            AuthenticationEvents::AUTHENTICATION_SUCCESS => 'onAuthenticationSuccess'
        ];
    }

    public function onAuthenticationSuccess(EventAuthenticationSuccessEvent $event) {
        /** @var \App\Entity\Main\Account $account */
        $account = $event->getAuthenticationToken()->getUser();
        if($account) {
            $this->dbService->switchTenantDb($account->getTenant()->getId());
            $this->roleService->initRoles($account); 
        }
    }
}