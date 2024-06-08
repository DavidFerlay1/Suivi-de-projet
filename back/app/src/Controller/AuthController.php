<?php

namespace App\Controller;

use App\Entity\Main\Account;
use App\Entity\Main\AccountRequest;
use App\Entity\Main\REQUEST_TYPE;
use App\Entity\Tenant\RoleProfile;
use App\Form\AccountType;
use App\Form\ResetPasswordRequestType;
use App\Form\ResetPasswordType;
use App\Form\TenantRegistrationType;
use App\Service\AuthService;
use App\Service\DbService;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Query\Parameter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/auth')]
class AuthController extends DefaultController
{
    #[Route('/register', methods:['POST'])]
    public function register(Request $request, AuthService $authService): JsonResponse
    {
        return $this->autoSubmitWithBehavior(
            $request, 
            AccountType::class, 
            Account::class, 
            [],
            function($submissionData) use ($authService) {
                $account = $submissionData->getEntity();
                if($submissionData->getStatus() === Response::HTTP_CREATED)
                    $account->setHasAccount(true);
                $authService->hashPassword($account);
                $this->mainEm->persist($account);
                $this->mainEm->flush();
            },
            function($submissionData) use ($authService) {
                return $authService->login($submissionData->getEntity(), $this->mainEm);
            }
        );
    }

    #[Route('/logout', methods:['GET'])]
    public function logout(AuthService $authService) {
        $authService->logout();
        return new JsonResponse('ok', Response::HTTP_OK);
    }

    #[Route('/password/request', methods:['POST'])]
    public function resetPasswordRequest(Request $request, AuthService $authService) {
        $payload = $this->getPayload($request);
        $form = $this->createForm(ResetPasswordRequestType::class);
        $form->submit($payload);

        if($form->isSubmitted() && $form->isValid()) {
            $account = $this->mainEm->getRepository(Account::class)->findOneBy(['username' => $payload['username']]);

            if(!$account)
                return new JsonResponse('assert.userNotFound', Response::HTTP_NOT_FOUND);

            $authService->handleResetPasswordRequest($account);
            
            return new JsonResponse('ok', Response::HTTP_CREATED);
        } 

        return new JsonResponse($this->manageFormErrors($form->getErrors(true)), Response::HTTP_BAD_REQUEST);
    }

    #[Route('/password/reset', methods:['POST'])]
    public function resetPassword(Request $request, AuthService $authService) {
        $payload = $this->getPayload($request);
        if(!isset($payload['token']))
            return new JsonResponse('missingParam.token', Response::HTTP_BAD_REQUEST);

        $qb = $this->mainEm->getRepository(AccountRequest::class)->createQueryBuilder('r');
        $qb->where('r.token = :token')
            ->andWhere('r.expiresAt > :now')
            ->andWhere('r.type = :type')
            ->setParameters(new ArrayCollection([
                new Parameter('now', new DateTimeImmutable()),
                new Parameter('token', $payload['token']),
                new Parameter('type', REQUEST_TYPE::RESET_PASSWORD->value)
            ]));

        $request = $qb->getQuery()->getOneOrNullResult();

        if(!$request) {
            return new JsonResponse('token expired', Response::HTTP_REQUEST_TIMEOUT);
        }

        unset($payload['token']);

        $form = $this->createForm(ResetPasswordType::class);
        $form->submit($payload);

        if($form->isSubmitted() && $form->isValid()){
            $account = $request->getAccount();
            $account->setRawPassword($payload['password']['first']);
            $authService->hashPassword($account);
            $authService->logout($account);
            $this->mainEm->remove($request);
            $this->mainEm->persist($account);
            $this->mainEm->flush();

            return new JsonResponse('ok', Response::HTTP_OK);
        }

        return new JsonResponse($this->manageFormErrors($form->getErrors(true)), Response::HTTP_BAD_REQUEST);
    }

    #[Route('/isGranted', methods:['GET'])]
    public function controlAccess(Request $request, AuthService $authService) {
        $data = json_decode($request->query->get('roles'));
        if(!$data)
            return new JsonResponse('BAD PARAMS', Response::HTTP_BAD_REQUEST);

        $granted = $authService->isGranted($data);
        return new JsonResponse($granted ? 'granted' : 'forbidden', $granted ? Response::HTTP_OK : Response::HTTP_FORBIDDEN);
    }

    #[Route('/moduleAccesses', methods:['GET'])]
    public function getModuleAccesses(AuthService $authService) {
        return new JsonResponse($authService->getModuleAccesses(), Response::HTTP_OK);
    }

    #[Route('/register_tenant', methods:['POST'])]
    public function testdb(Request $request, DbService $dbService, AuthService $authService) {

        return $this->autoSubmitWithBehavior(
                            $request,
                            TenantRegistrationType::class,
                            Account::class,
                            [],
                            function ($submissionData) use ($dbService, $authService, $request) {
                                /** @var \App\Entity\Main\Account $account */
                                $account = $submissionData->getEntity();
                                $authService->hashPassword($account);
                                $account->setHasAccount(true);
                                $payload = $this->getPayload($request);
                                $dbService->createTenant($account, $payload['organization']);
                            },
                            null,
                            function () {
                                return new JsonResponse('assert.dbNotCreated', Response::HTTP_INTERNAL_SERVER_ERROR);
                            }
        );
    }

    #[Route('/requirePermissions', methods:['GET'])]
    public function getPermissions(Request $request, AuthService $authService) {
        $data = json_decode($request->query->get('roles'));
        if(!$data)
            return new JsonResponse('BAD PARAMS', Response::HTTP_BAD_REQUEST);

        return new JsonResponse($authService->getRolesAmong($data), Response::HTTP_OK);
    }
}
