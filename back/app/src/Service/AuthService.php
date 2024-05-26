<?php

namespace App\Service;

use App\Entity\Main\Account;
use App\Entity\Main\AccountRequest;
use App\Entity\Main\Profile;
use App\Entity\Main\RefreshToken;
use App\Entity\Main\REQUEST_TYPE;
use App\Entity\Tenant\AccountRoleProfiles;
use App\Entity\Tenant\RoleProfile;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Parameter;
use Doctrine\ORM\Query\ResultSetMapping;
use Doctrine\ORM\QueryBuilder;
use Gesdinet\JWTRefreshTokenBundle\Generator\RefreshTokenGeneratorInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class AuthService {
    
    public function __construct(
        private ParameterBagInterface $params,
        private UserPasswordHasherInterface $hasher,
        private JWTTokenManagerInterface $jwtManager,
        private RefreshTokenManagerInterface $refreshTokenManager,
        private RefreshTokenGeneratorInterface $refreshTokenGenerator,
        private TokenStorageInterface $tokenStorage,
        private EntityManagerInterface $mainEm,
        private TenantEntityManager $em,
        private MailService $mailService
    ){}

    public function hashPassword(Account $account) {
        $account->setPassword($this->hasher->hashPassword($account, $account->getRawPassword()));
    }

    public function login(Account $account) { 
        $refreshToken = $this->refreshTokenGenerator->createForUserWithTtl($account, $this->params->get('gesdinet_jwt_refresh_token.ttl'));
        $this->mainEm->persist($refreshToken);
        $this->mainEm->flush();

        return [
            'token' => $this->jwtManager->create($account),
            'refresh_token' => $refreshToken->getRefreshToken(),
        ];
    }

    public function logout(Account|null $account = null) {
        $account = $account ?? $this->tokenStorage->getToken()->getUserIdentifier();
        $tokensToRevoke = $this->mainEm->getRepository(RefreshToken::class)->findBy(['username' => $account]);
        foreach($tokensToRevoke as $token)
            $this->mainEm->remove($token);

        $this->mainEm->flush();
    }

    public function handleResetPasswordRequest(Account $account) {
        $qb = $this->mainEm->getRepository(AccountRequest::class)->createQueryBuilder('r');
            $qb->where('r.account = :account')
                ->andWhere('r.type = :type')
                ->setParameters(new ArrayCollection([
                    new Parameter('account', $account),
                    new Parameter('type', REQUEST_TYPE::RESET_PASSWORD->value)
                ]));
    
            $requests = $qb->getQuery()->getResult();
    
            foreach($requests as $request)
                $this->mainEm->remove($request);
    
            $request = AccountRequest::create(REQUEST_TYPE::RESET_PASSWORD, $account);

            $this->mainEm->persist($request);
            $this->mainEm->flush();

            $this->mailService->sendPasswordRequestEmail($account, $request->getToken());
    }

    public function handleAccountCreationByAdmin(Account $account) {
        $passwordLength = 12;
        $account->setRawPassword(substr(bin2hex(openssl_random_pseudo_bytes(($passwordLength + 1) / 2)), 0, $passwordLength));
        $this->hashPassword($account);
        $this->mainEm->persist($account);
        $this->mainEm->flush();
        $this->mailService->sendAccountCreatedByAdminConfirmation($account);
    }

    public function isGranted(array $roles) {
        $roleProfiles = $this->getSelfRoleProfiles();

        foreach($roleProfiles as $profile) {
            if(in_array('ROLE_SUPERADMIN', $profile->getRoles()))
                return true;
            $roles = array_diff($roles, $profile->getRoles());
            if(empty($roles))
                return true;
        }

        return false;
    }

    public function getModuleAccesses() {
        $roleProfiles = $this->getSelfRoleProfiles();

        $accesses = [];

        foreach($roleProfiles as $profile) {
            $roles = preg_grep('/^ROLE_MODULE|ROLE_SUPERADMIN/', $profile->getRoles());
            if($roles) {
                foreach($roles as $role) {
                    if(!in_array($role, $accesses))
                        $accesses[] = $role;
                }
            }
        }

        return $accesses;
    }

    public function getRolesAmong(array $roles) {
        $roleProfiles = $this->getSelfRoleProfiles();
        $accesses = [];
        foreach($roleProfiles as $profile) {
            if(in_array('ROLE_SUPERADMIN', $profile->getRoles()))
                return $roles;
            $accesses = array_unique(array_merge($accesses, array_intersect($roles, $profile->getRoles())));
        }

        return $accesses;
    }   

    protected function getSelfRoleProfiles() {
        /** @var \App\Entity\Main\Account $account */
        $account = $this->tokenStorage->getToken()->getUser();
        $roleProfileSet = $this->em->getRepository(AccountRoleProfiles::class)->findOneBy(['accountId' => $account->getId()]);
        if(!$roleProfileSet)
            return [];

        return $roleProfileSet->getRoleProfiles();
    }

    public function deleteRoleProfile(RoleProfile $roleProfile) {
         /** @var \App\Entity\Main\Account $user */
         $user = $this->tokenStorage->getToken()->getUser();

         $rsm = new ResultSetMapping();

         $rsm->addEntityResult('App\Entity\Main\Account', "entity");
         $rsm->addFieldResult('entity', "id", "id");

         $sql = "SELECT * FROM profile entity WHERE entity.type = 'account' AND WHERE JSON_CONTAINS(entity.role_profile_ids, :id) = 1";
         $query = $this->mainEm->createNativeQuery($sql, $rsm)->setParameters(['id' => $roleProfile->getId()]);

         dd($query->getResult());
    }

    /** QB_FILTER */
    public function filterProfilesByRoleProfiles(QueryBuilder $qb, array $roleProfileIds, string $alias = 'entity') {
        $subQb = $this->em->getRepository(AccountRoleProfiles::class)->createQueryBuilder('setting');
        $subQb->leftJoin('setting.roleProfiles', 'roleProfile')->where($subQb->expr()->in('roleProfile.id', ':roleProfileIds'))->setParameter("roleProfileIds", $roleProfileIds);

        $configs = $subQb->getQuery()->getResult();
        if(count($configs))
            return $qb->andWhere($qb->expr()->in("$alias.id", array_map(fn($conf) => $conf->getAccountId(), $configs)));

        return $qb->andWhere("$alias.id IS NULL");
    }

    /** QB_FILTER */
    public function filterProfilesByState(QueryBuilder $qb, array $states, string $alias = 'entity') {

        $associations = [
            "profile" => "$alias INSTANCE OF App\Entity\Main\Profile AND $alias NOT INSTANCE OF App\Entity\Main\Account",
            "account" => "$alias INSTANCE OF App\Entity\Main\Account"
        ];

        if(!count(array_intersect(array_keys($associations), $states)))
            return $qb;
        
        $orX = $qb->expr()->orX();

        foreach($states as $state) {
            if(array_key_exists($state, $associations)) {
                $orX->add($associations[$state]);
            }
        }

        $qb->andWhere($orX);

        return $qb;
    } 
}