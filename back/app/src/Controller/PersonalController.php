<?php

namespace App\Controller;

use App\Entity\Main\Account;
use App\Entity\Main\Profile;
use App\Entity\Tenant\AccountRoleProfiles;
use App\Entity\Tenant\RoleProfile;
use App\Form\AccountHandledByAdminType;
use App\Form\AccountType;
use App\Form\ProfileToAccountType;
use App\Form\ProfileType;
use App\Form\RoleProfileType;
use App\Models\QueryFilters;
use App\Service\AuthService;
use App\Service\RoleService;
use Doctrine\ORM\EntityManagerInterface;
use QueryFiltersOptions;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/personal')]
class PersonalController extends DefaultController
{
    #[Route('', methods:['POST'])]
    public function createUpdate(Request $request, AuthService $authService, RoleService $roleService)
    {
        $payload = $this->getPayload($request);
        $createAccount = false;
        $hasAccount = $payload['hasAccount'];
        unset($payload['hasAccount']);

        if(isset($payload['createAccount'])) {
            $createAccount = $payload['createAccount'];
            unset($payload['createAccount']);
        } 

        if(!$createAccount && !$hasAccount && isset($payload['roleProfiles']))
            unset($payload['roleProfiles']);

        $createFromProfile = $createAccount && isset($payload['id']);
        if($createFromProfile)
            unset($payload['id']);

        return $this->autoSubmitWithBehavior(
            $payload,
            ($createAccount || $hasAccount) ? ($createFromProfile ? ProfileToAccountType::class : AccountHandledByAdminType::class) : ProfileType::class,
            ($createAccount || $hasAccount) ? Account::class : Profile::class,
            ['em' => EntityManagerInterface::class],
            function($submissionData) use ($createFromProfile, $createAccount, $hasAccount, $authService) {
                if($submissionData->getStatus() === Response::HTTP_CREATED) {
                    $created = $submissionData->getEntity();
                    $created->setHasAccount($createAccount || $hasAccount);
                    /** @var \App\Entity\Main\Account $currentAdmin */
                    $currentAdmin = $this->getUser();
                    $created->setTenant($currentAdmin->getTenant());

                    if($createAccount) {
                        /** @var \App\Entity\Main\Account $created */
                        if($createFromProfile) {
                            $profileToFlush = $this->mainEm->getRepository(Profile::class)->findOneBy(['username' => $created->getUsername()]);
                            $this->mainEm->remove($profileToFlush);
                            $this->mainEm->flush();
                        }
                        $authService->handleAccountCreationByAdmin($created);                     
                    } 
                }

                $this->mainEm->persist($submissionData->getEntity());
                $this->mainEm->flush();

                if($hasAccount || $createAccount) {      
                    $roleProfileSet = $this->em->getRepository(AccountRoleProfiles::class)->findOneBy(['accountId' => $submissionData->getEntity()->getId()]);
                    // dd($created->getRoleProfiles());
                    if(!$roleProfileSet)
                        $roleProfileSet = (new AccountRoleProfiles())->setAccountId($submissionData->getEntity()->getId());

                    $roleProfileSet->setRoleProfiles($submissionData->getEntity()->getRoleProfiles());
                    $this->em->persist($roleProfileSet);
                    $this->em->flush();
                }
            },
            function ($submissionData) {
                return $this->jsonize($submissionData->getEntity(), ['get']);
            }
        );
    }

    #[Route('', methods:['GET'])]
    public function getAll(Request $request): JsonResponse {
        /** @var \App\Entity\Main\Account $currentUser */
        $currentUser = $this->getUser();

        return $this->jsonResponse(
            $this->mainEm->getRepository(Profile::class)->findFilteredByTenant($this->getCurrentTenant(), $this->getQueryFilters($request),
                (new QueryFiltersOptions())->setExcludeValues([$currentUser->getUsername(), 'super@gmail.com'])
            ),
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
    public function getAllRoleProfiles(Request $request): JsonResponse {
        return $this->jsonResponse(
            $this->em->getRepository(RoleProfile::class)
                ->findFilteredByTenant(
                    $this->getQueryFilters($request), 
                    (new QueryFiltersOptions())->setExcludeValues(['ROLE_SUPERADMIN'])
                )
        );
    }

    #[Route('/roleProfiles/search', methods:['GET'])]
    public function getRoleProfilesSuggestions(Request $request): JsonResponse {
        $search = $this->getSearch($request);
        $queryFilters = new QueryFilters(1, ['sortBy' => 'ASC', 'orderBy' => 'name'], $search);

        return
            $this->jsonResponse(
                $this->em->getRepository(RoleProfile::class)
                            ->findFilteredByTenant(
                                $queryFilters,
                                (new QueryFiltersOptions())->setExcludeValues(['ROLE_SUPERADMIN'])->setMaxResult(10)
                        )
                );

    }

    #[Route('/roleProfile/{id}', methods: ['DELETE'])]
    public function deleteRoleProfile(RoleProfile $roleProfile, AuthService $authService): JsonResponse {
        $authService->deleteRoleProfile($roleProfile);
    }

    #[Route('/roles', methods:['GET'])]
    public function getAllRoles(RoleService $roleService): JsonResponse {
        return $this->jsonResponse($roleService->getRoles());
    }
}
