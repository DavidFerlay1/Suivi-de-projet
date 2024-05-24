<?php

namespace App\Repository\Tenant;

use App\Entity\Tenant\AccountRoleProfiles;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AccountRoleProfiles>
 *
 * @method AccountRoleProfiles|null find($id, $lockMode = null, $lockVersion = null)
 * @method AccountRoleProfiles|null findOneBy(array $criteria, array $orderBy = null)
 * @method AccountRoleProfiles[]    findAll()
 * @method AccountRoleProfiles[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AccountRoleProfilesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AccountRoleProfiles::class);
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
