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

    #[Route('/{id}', methods: ['DELETE'])]
    public function deleteRoleProfile(RoleProfile $roleProfile, AuthService $authService): JsonResponse {
        $authService->deleteRoleProfile($roleProfile);
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

    #[Route('/byAccounts', methods:['GET'])]
    public function getByAccounts(Request $request) {
        // $accountRoleProfiles = $this->em->getRepository(AccountRoleProfiles::class)->findFilteredByTenant(
        //     $this->getQueryFilters($request), 
        // );

        // $roleProfiles = [];

        // foreach($accountRoleProfiles as $accountRoleProfile) {
        //     foreach($accountRoleProfile->getRoleProfiles() as $roleProfile) {
        //         if(in_array($roleProfile, $roleProfiles))
        //             $roleProfiles[] = $roleProfile;
        //     }
        // }

        // return $this->jsonResponse($roleProfiles, Response::HTTP_OK, ['get']);
    }
}
