<?php

namespace App\DataFixtures;

use App\Entity\Main\TenantDb;
use App\Service\AuthService;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Loader;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\ORM\EntityManagerInterface;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;

class FixtureLoader {
    public function __construct(private TenantEntityManager $em) {}

    public function initTenantData() {
        $loader = new Loader();
        $loader->addFixture(new RoleProfileFixtures());
        $tenantPurger = new ORMPurger($this->em);
        $tenantExecutor = new ORMExecutor($this->em, $tenantPurger);
        $tenantExecutor->execute($loader->getFixtures());
    }  
}