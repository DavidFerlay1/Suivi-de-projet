<?php

namespace App\Repository\Main;

use App\Entity\Main\Profile;
use App\Entity\Main\TenantDb;
use App\Trait\PaginableTrait;
use App\Trait\QueryFiltersTrait;
use App\Trait\SortableTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProfileRepository extends ServiceEntityRepository
{
    use QueryFiltersTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Profile::class);
        $this->maxPerPage = 18;
    }

    public function findFilteredByTenant(TenantDb $db, int|null $page = null, array $options = []) {
        $qb = $this->createQueryBuilder('entity')->where('entity.tenant = :tenant')->setParameter('tenant', $db);
        return $this->withQueryFilters($qb, $page, $options['sortSettings']);
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
