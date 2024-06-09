<?php

namespace App\Repository\Tenant;

use App\Entity\Tenant\AccountRoleProfiles;
use App\Entity\Tenant\RoleProfile;
use App\Models\QueryFilters;
use App\Service\LocatorService;
use DefaultRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use QueryFiltersOptions;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

/**
 * @extends ServiceEntityRepository<AccountRoleProfiles>
 *
 * @method AccountRoleProfiles|null find($id, $lockMode = null, $lockVersion = null)
 * @method AccountRoleProfiles|null findOneBy(array $criteria, array $orderBy = null)
 * @method AccountRoleProfiles[]    findAll()
 * @method AccountRoleProfiles[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AccountRoleProfilesRepository extends DefaultRepository
{
    public function __construct(ManagerRegistry $registry, ParameterBagInterface $params, LocatorService $locatorService)
    {
        parent::__construct($registry, AccountRoleProfiles::class, $params, $locatorService);
    }

    public function getFilteredList(QueryFilters $queryFilters, QueryFiltersOptions $options = new QueryFiltersOptions()) {
        $qb = $this->createQueryBuilder('entity')
            ->select('entity');

        return $this->getFilteredQueryResultSet(AccountRoleProfiles::class, $queryFilters, $qb);
    }

    //    /**
    //     * @return AccountRoleProfiles[] Returns an array of AccountRoleProfiles objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('a.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?AccountRoleProfiles
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
