<?php

namespace App\Listeners;

use App\Annotation\PermissionAnnotation;
use App\Service\RoleService;
use ReflectionMethod;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ControllerEvent;

class KernelRequestListener {

    public function __construct(private Security $security, private RoleService $roleService)
    {
        
    }

    public function onKernelController(ControllerEvent $event) {
        $controller = $event->getController();

        if(!is_array($controller))
            return;

        $reflectionMethod = new ReflectionMethod($controller[0], $controller[1]);
        $attributes = $reflectionMethod->getAttributes(PermissionAnnotation::class);

        if($attributes) {
            $attributeInstance = $attributes[0]->newInstance();

            /** @var \App\Entity\Main\Account $user */
            $user = $this->security->getUser();

            if(!$user || !$this->roleService->hasRequiredRoles($user, $attributeInstance->roles)) {
                $event->setController(function() {
                    return new JsonResponse('access_denied_for_no_permission', Response::HTTP_FORBIDDEN);
                });
            }

            return 'bahja';
        }
    }
}