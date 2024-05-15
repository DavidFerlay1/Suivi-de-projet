<?php

namespace App\Repository\Main;

use App\Entity\Main\Account;
use App\Entity\Main\AccountRequest;
use App\Entity\Main\REQUEST_TYPE;
use DateTime;
use DateTimeImmutable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AccountRequest>
 *
 * @method AccountRequest|null find($id, $lockMode = null, $lockVersion = null)
 * @method AccountRequest|null findOneBy(array $criteria, array $orderBy = null)
 * @method AccountRequest[]    findAll()
 * @method AccountRequest[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AccountRequestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AccountRequest::class);
    }

    //    /**
    //     * @return AccountRequest[] Returns an array of AccountRequest objects
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

    //    public function findOneBySomeField($value): ?AccountRequest
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
