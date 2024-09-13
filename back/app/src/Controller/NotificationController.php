<?php

namespace App\Controller;

use App\Entity\Tenant\Notification;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route("/notifications")]
class NotificationController extends DefaultController {

    #[Route("/{notif}", methods:['PUT'])]
    public function setAsReaded(Notification $notif) {
        /** @var App\Entity\Main\Account $account */
        $account = $this->security->getUser();

        if($account && $notif->getRecipientId() === $account->getId()) {
            $this->em->remove($notif);
            $this->em->flush();
            return new JsonResponse("notification readed", Response::HTTP_OK);
        }

        return new JsonResponse("notification not found", Response::HTTP_NOT_FOUND);
    }

    #[Route("", methods:['PUT'])]
    public function setAllReaded() {
        /** @var App\Entity\Main\Account $account */
        $account = $this->security->getUser();

        if($account) {
            $this->em->createQueryBuilder()
                ->delete(Notification::class, 'n')
                ->where('n.recipientId = :userId')->setParameter('userId', $account->getId())
                ->getQuery()
                ->execute();

            return new JsonResponse('ok', Response::HTTP_OK);
        }

        return new JsonResponse('bad user', Response::HTTP_UNAUTHORIZED);
    }

    #[Route("", methods:['GET'])]
    public function getNotifications() {
        /** @var App\Entity\Main\Account $account */
        $account = $this->security->getUser();

        return new JsonResponse(
            $this->jsonize($this->em->getRepository(Notification::class)->findBy(['recipientId' => $account->getId()]), ['get']),
            Response::HTTP_OK
        );
    }
}