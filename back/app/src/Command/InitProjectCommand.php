<?php

namespace App\Command;

use App\DataFixtures\FixtureLoader;
use App\Entity\Main\Account;
use App\Entity\Main\TenantDb;
use App\Service\AuthService;
use App\Service\DbService;
use Doctrine\ORM\EntityManagerInterface;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use RuntimeException;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:init-project',
    description: 'Add a short description for your command',
)]
class InitProjectCommand extends Command
{
    public function __construct(
        private TenantEntityManager $em, 
        private EntityManagerInterface $mainEm, 
        private DbService $dbService,
        private FixtureLoader $fixtureLoader,
        private AuthService $authService
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $qb = $this->mainEm->getRepository(TenantDb::class)->createQueryBuilder('t');
        $id = $qb->select('MAX(t.id)')->getQuery()->getSingleScalarResult();
        $id = $id ? $id +1 : 1;

        $tenantConfig = (new TenantDb())->setDbName("tenant_$id")->setOrganization("Organisation Test");
        $this->mainEm->persist($tenantConfig);
        $this->mainEm->flush();

        $email = "jatiffe@gmail.com";

        if($this->mainEm->getRepository(Account::class)->findOneBy(['username' => $email]))
            throw new RuntimeException("$email already exists");

        $tenantAccount = (new Account())
                            ->setUsername($email)
                            ->setFirstname("Jasserge")
                            ->setLastName("Plintiffe")
                            ->setRawPassword("azerty1234")
                            ->setTenant($tenantConfig)
                            ->setHasAccount(true);

        $this->authService->hashPassword($tenantAccount);
        $this->mainEm->persist($tenantAccount);

        $this->dbService->createTenant($tenantAccount, 'Organisation Test');

        $this->mainEm->flush();

        return Command::SUCCESS;
    }
}
