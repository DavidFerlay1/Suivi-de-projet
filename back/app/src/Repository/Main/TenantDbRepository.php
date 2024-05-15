<?php

namespace App\Repository\Main;

use App\Entity\Main\TenantDb;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TenantDb>
 *
 * @method TenantDb|null find($id, $lockMode = null, $lockVersion = null)
 * @method TenantDb|null findOneBy(array $criteria, array $orderBy = null)
 * @method TenantDb[]    findAll()
 * @method TenantDb[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TenantDbRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TenantDb::class);
    }

    //    /**
    //     * @return TenantDb[] Returns an array of TenantDb objects
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

    //    public function findOneBySomeField($value): ?TenantDb
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
