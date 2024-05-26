<?php

namespace App\Repository\Tenant;

use App\Entity\Tenant\RoleProfile;
use App\Models\QueryFilters;
use App\Service\LocatorService;
use App\Trait\QueryFiltersTrait;
use DefaultRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use QueryFiltersOptions;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

/**
 * @extends ServiceEntityRepository<RoleProfile>
 *
 * @method RoleProfile|null find($id, $lockMode = null, $lockVersion = null)
 * @method RoleProfile|null findOneBy(array $criteria, array $orderBy = null)
 * @method RoleProfile[]    findAll()
 * @method RoleProfile[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RoleProfileRepository extends DefaultRepository
{
    public function __construct(ManagerRegistry $registry, ParameterBagInterface $params, LocatorService $locatorService)
    {
        parent::__construct($registry, RoleProfile::class, $params, $locatorService);
        $this->maxPerPage = 16;
    }

    public function findFilteredByTenant(QueryFilters $queryFilters, QueryFiltersOptions $options = new QueryFiltersOptions()) {
        $qb = $this->createQueryBuilder('entity');
        foreach($options->getExcludeValues() as $index => $excludedRole) {
            $qb->andWhere("entity.roles NOT LIKE :excluded$index")
            ->setParameter("excluded$index", "%$excludedRole%");
        }

        return $this->getFilteredQueryResultSet(RoleProfile::class, $queryFilters, $qb);
    }
}
