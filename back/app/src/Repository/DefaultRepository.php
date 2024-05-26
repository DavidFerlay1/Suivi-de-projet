<?php

use App\Models\QueryFilters;
use App\Trait\QueryFiltersTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use App\Service\LocatorService;

abstract class DefaultRepository extends ServiceEntityRepository {

    use QueryFiltersTrait;

    public function __construct(ManagerRegistry $registry, string $entityName, ParameterBagInterface $params, LocatorService $locator)
    {
        parent::__construct($registry, $entityName);
        $this->initParamAccesses($params, $locator);
    }

    public function findWithQueryFilters(QueryFilters $queryFilters, QueryBuilder|null $qb = null, string $alias = 'entity', QueryFiltersOptions $options = new QueryFiltersOptions()) {
        if(!$qb) 
            $qb = $this->createQueryBuilder($alias);

        return $this->getFilteredQueryResultSet($this->getEntityName(), $queryFilters, $qb, $alias, $options);
    }
}