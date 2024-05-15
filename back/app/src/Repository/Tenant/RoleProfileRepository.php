<?php

namespace App\Repository\Tenant;

use App\Entity\Tenant\RoleProfile;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RoleProfile>
 *
 * @method RoleProfile|null find($id, $lockMode = null, $lockVersion = null)
 * @method RoleProfile|null findOneBy(array $criteria, array $orderBy = null)
 * @method RoleProfile[]    findAll()
 * @method RoleProfile[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RoleProfileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RoleProfile::class);
    }

    //    /**
    //     * @return RoleProfile[] Returns an array of RoleProfile objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('r.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?RoleProfile
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
