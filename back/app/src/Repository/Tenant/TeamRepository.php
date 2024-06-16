<?php

namespace App\Repository\Tenant;

use App\Entity\Tenant\Team;
use App\Models\QueryFilters;
use App\Models\QueryFiltersOptions;
use App\Service\LocatorService;
use DefaultRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

/**
 * @extends ServiceEntityRepository<Team>
 *
 * @method Team|null find($id, $lockMode = null, $lockVersion = null)
 * @method Team|null findOneBy(array $criteria, array $orderBy = null)
 * @method Team[]    findAll()
 * @method Team[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TeamRepository extends DefaultRepository
{
    public function __construct(ManagerRegistry $registry, ParameterBagInterface $params, LocatorService $locatorService)
    {
        parent::__construct($registry, Team::class, $params, $locatorService);
        // $this->maxPerPage = 2;
    }

    public function getFilteredList(QueryFilters $queryFilters, QueryFiltersOptions $options = new QueryFiltersOptions()) {
        $qb = $this->createQueryBuilder('entity')->select('entity');
        return $this->getFilteredQueryResultSet(Team::class, $queryFilters, $qb);
    }

    //    /**
    //     * @return Team[] Returns an array of Team objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Team
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
