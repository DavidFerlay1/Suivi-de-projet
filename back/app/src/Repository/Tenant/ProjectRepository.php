<?php

namespace App\Repository\Tenant;

use App\Entity\Tenant\Project;
use App\Models\QueryFilters;
use App\Models\QueryFiltersOptions;
use App\Service\LocatorService;
use App\Trait\PaginableTrait;
use DefaultRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

/**
 * @extends ServiceEntityRepository<Project>
 *
 * @method Project|null find($id, $lockMode = null, $lockVersion = null)
 * @method Project|null findOneBy(array $criteria, array $orderBy = null)
 * @method Project[]    findAll()
 * @method Project[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectRepository extends DefaultRepository
{

    use PaginableTrait;

    public function __construct(ManagerRegistry $registry, ParameterBagInterface $params, LocatorService $locatorService)
    {
        parent::__construct($registry, Project::class, $params, $locatorService);
    }


    public function getFilteredList(QueryFilters $queryFilters, QueryFiltersOptions $options = new QueryFiltersOptions()) {
        $qb = $this->createQueryBuilder('entity')
            ->select('entity');

        return $this->getFilteredQueryResultSet(Project::class, $queryFilters, $qb);
    }

//    /**
//     * @return Project[] Returns an array of Project objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Project
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
