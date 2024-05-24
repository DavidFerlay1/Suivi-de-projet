<?php

namespace App\Repository\Main;

use App\Entity\Main\Profile;
use App\Entity\Main\TenantDb;
use App\Models\QueryFilters;
use DefaultRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use QueryFiltersOptions;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProfileRepository extends DefaultRepository
{
    public function __construct(ManagerRegistry $registry, ParameterBagInterface $params)
    {
        parent::__construct($registry, Profile::class, $params);
        $this->maxPerPage = 16;
    }

    public function findFilteredByTenant(TenantDb $db, QueryFilters $queryFilters, QueryFiltersOptions $options = new QueryFiltersOptions()) {
        $qb = $this->createQueryBuilder('entity')
                        ->where('entity.tenant = :tenant')
                        ->setParameter('tenant', $db);

        if(count($options->getExcludeValues()))
            $qb->andWhere($qb->expr()->notIn('entity.username', ':excluded'))->setParameter('excluded', $options->getExcludeValues());

        return $this->getFilteredQueryResultSet(Profile::class, $queryFilters, $qb);
    }

//    /**
//     * @return User[] Returns an array of User objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?User
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
