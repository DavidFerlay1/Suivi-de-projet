<?php

namespace App\Controller;

use App\Entity\Main\TenantDb;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/tenancy')]
class TenancyController extends AbstractController
{
    #[Route('/', name: 'app_tenancy')]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $tenantConfig = new TenantDb();
        $tenantConfig->setDbName('tenant1');
        $em->persist($tenantConfig);
        $em->flush();

        return new JsonResponse('ok');
    }
}
