<?php

namespace App\Repository\Tenant;

use App\Entity\Tenant\CalendarEventInvitation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CalendarEventInvitation>
 *
 * @method CalendarEventInvitation|null find($id, $lockMode = null, $lockVersion = null)
 * @method CalendarEventInvitation|null findOneBy(array $criteria, array $orderBy = null)
 * @method CalendarEventInvitation[]    findAll()
 * @method CalendarEventInvitation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CalendarEventInvitationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CalendarEventInvitation::class);
    }

    //    /**
    //     * @return CalendarEventInvitation[] Returns an array of CalendarEventInvitation objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?CalendarEventInvitation
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
