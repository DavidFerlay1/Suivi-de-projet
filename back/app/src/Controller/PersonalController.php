<?php

namespace App\Controller;

use App\Entity\Main\Account;
use App\Entity\Main\Profile;
use App\Entity\Tenant\RoleProfile;
use App\Form\AccountHandledByAdminType;
use App\Form\AccountType;
use App\Form\ProfileType;
use App\Form\RoleProfileType;
use App\Service\AuthService;
use App\Service\RoleService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/personal')]
class PersonalController extends DefaultController
{
    #[Route('', methods:['POST'])]
    public function createUpdate(Request $request, AuthService $authService, RoleService $roleService): JsonResponse
    {
        $payload = $this->getPayload($request);
        $isAccount = isset($payload['hasAccount']) && $payload['hasAccount'];
        $createAccount = $payload['createAccount'];

        unset($payload['hasAccount']);
        unset($payload['createAccount']);

        if(!$isAccount)
            unset($payload['roleProfileIds']);

        return $this->autoSubmitWithBehavior(
            $payload,
            $isAccount || $createAccount ? AccountHandledByAdminType::class : ProfileType::class,
            $isAccount || $createAccount ? Account::class : Profile::class,
            ['em' => $this->mainEm],
            function($submissionData) use ($isAccount, $createAccount, $authService) {
                $entity = $submissionData->getEntity();
                $entity->setHasAccount($isAccount || $createAccount);
                /** @var \App\Entity\Main\Account $currentUser */
                $currentUser = $this->getUser();
                $entity->setTenant($currentUser->getTenant());
                if(($submissionData->getStatus() === Response::HTTP_CREATED && $isAccount) || $createAccount) {
                    $authService->handleAccountCreationByAdmin($entity);
                } else {
                    $this->mainEm->persist($entity);
                    $this->mainEm->flush();
                }
            },
            function ($submissionData) {
                return $submissionData->getEntity()->getId();
            }
        );
        
    }

    #[Route('', methods:['GET'])]
    public function getAll(Request $request): JsonResponse {

        return $this->jsonResponse(
            $this->mainEm->getRepository(Profile::class)->findAllPaginatedByTenant($this->getCurrentTenant(), $this->getPage($request)),
            Response::HTTP_OK,
            ['get']
        );
    }

    #[Route('/{id}', methods:['delete'])]
    public function delete(Profile $profile): JsonResponse {
        $this->mainEm->remove($profile);
        $this->mainEm->flush();
        return new JsonResponse('ok', Response::HTTP_OK);
    }


    #[Route('/roleProfiles', methods:['POST'])]
    public function createUpdateRoleProfile(Request $request): JsonResponse {
        return $this->autoSubmitWithBehavior(
            $request,
            RoleProfileType::class,
            RoleProfile::class,
            [],
            function ($submissionData) {
                $this->em->persist($submissionData->getEntity());
                $this->em->flush();
            }
        );
    }

    #[Route('/roleProfiles', methods:['GET'])]
    public function getAllRoleProfiles(): JsonResponse {
        return $this->jsonResponse($this->em->getRepository(RoleProfile::class)->findAll(), Response::HTTP_OK, ['light']);
    }

    #[Route('/roles', methods:['GET'])]
    public function getAllRoles(RoleService $roleService): JsonResponse {
        return $this->jsonResponse($roleService->getRoles());
    }
}
