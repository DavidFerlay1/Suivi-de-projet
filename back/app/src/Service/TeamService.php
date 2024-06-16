<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;

class TeamService {

    public function __construct(private EntityManagerInterface $mainEm, private TenantEntityManager $em)
    {
        
    }
}