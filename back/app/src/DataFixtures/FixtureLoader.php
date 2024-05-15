<?php

namespace App\DataFixtures;

use App\Service\DbService;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Loader;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
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