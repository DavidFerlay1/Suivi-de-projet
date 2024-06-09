<?php

namespace App\Controller;

use App\Entity\Tenant\AccountRoleProfiles;
use App\Entity\Tenant\RoleProfile;
use App\Form\RoleProfileType;
use App\Models\QueryFilters;
use App\Service\AuthService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/personal/roleProfiles')]
class RoleProfileController extends DefaultController
{
    #[Route('/getRoles/{id}', methods:['GET'])]
    public function getRoleProfileRoles(RoleProfile $roleProfile) {
        if(!$roleProfile)
            return new JsonResponse('invalid param', Response::HTTP_BAD_REQUEST);

        return $this->jsonResponse($roleProfile->getRoles(), Response::HTTP_OK);
    }

    #[Route('', methods:['POST'])]
    public function createUpdate(Request $request) {

        $data = $this->getPayload($request);
        unset($data['listable']);
        unset($data['immutable']);
        unset($data['settable']);

        return $this->autoSubmitWithBehavior(
            $data,
            RoleProfileType::class,
            RoleProfile::class,
            [],
            function ($submitHandler) {
                 /** @var \App\Entity\Tenant\RoleProfile $roleProfile */
                $roleProfile = $submitHandler->getEntity();
                $roleProfile->setRoles(array_values($roleProfile->getRoles()));

                if($roleProfile->isImmutable())
                    throw new AutoSubmitBehaviorException('role is immutable');

                if($submitHandler->getStatus() === Response::HTTP_CREATED) {
                    $roleProfile->setImmutable(false);
                    $roleProfile->setSettable(true);
                    $roleProfile->setListable(true);
                }

                $this->em->persist($roleProfile);
                $this->em->flush();
            },
            null,
            function() {
                return new JsonResponse('assert.immutableRole', Response::HTTP_FORBIDDEN);
            }
        );
    } 

    #[Route('/{id}', methods:['DELETE'])]
    public function delete(RoleProfile $roleProfile, AuthService $authService) {
        if(!$roleProfile)
            return new JsonResponse("bad params", Response::HTTP_BAD_REQUEST);

        $authService->deleteRoleProfile($roleProfile);

        return new JsonResponse('ok', Response::HTTP_OK);
                                    
    }
}
