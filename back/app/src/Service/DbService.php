<?php

namespace App\Service;

use App\Controller\AutoSubmitBehaviorException;
use App\DataFixtures\FixtureLoader;
use App\Entity\Main\Account;
use App\Entity\Main\TenantDb;
use App\Entity\Tenant\RoleProfile;
use Doctrine\ORM\EntityManagerInterface;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Hakam\MultiTenancyBundle\Event\SwitchDbEvent;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Process\Process;

class DbService {
    public function __construct(
        private EventDispatcherInterface $dispatcher, 
        private EntityManagerInterface $mainEm, 
        private TenantEntityManager $em, 
        private FixtureLoader $fixtureLoader,
        private ParameterBagInterface $params
    ){}

    public function switchTenantDb(int|string $tenantId) {
        $this->dispatcher->dispatch(new SwitchDbEvent($tenantId));
    }

    public function createTenant(Account $account, string $organization) {
        $qb = $this->mainEm->getRepository(TenantDb::class)->createQueryBuilder('t');
        $id = $qb->select('MAX(t.id)')->getQuery()->getSingleScalarResult();
        $id = $id ? $id +1 : 1;

        $tenantConfig = (new TenantDb())->setDbName("tenant_$id")->setOrganization($organization);
        $this->mainEm->persist($tenantConfig);
        $this->mainEm->flush();

        $directory = $this->params->get('kernel.project_dir');
        $command = 'php bin/console t:d:c --no-interaction';
        $process = Process::fromShellCommandline($command, $directory);
        $process->run();

        if(!$process->isSuccessful()) {
            throw new AutoSubmitBehaviorException();
        }

        $this->switchTenantDb($tenantConfig->getId());
        $this->fixtureLoader->initTenantData();

        $superAdminProfile = $this->em->getRepository(RoleProfile::class)->createQueryBuilder('r')
                                            ->where('r.roles LIKE :superadmin')
                                            ->setParameter('superadmin', '%ROLE_SUPERADMIN%')
                                            ->getQuery()->getOneOrNullResult();
        
        $account->addRoleProfileId($superAdminProfile->getId())->setTenant($tenantConfig);

        $this->mainEm->persist($account);
        $this->mainEm->flush();
    }
}