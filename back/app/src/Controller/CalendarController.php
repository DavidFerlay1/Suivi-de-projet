<?php

namespace App\Controller;

use App\Annotation\PermissionAnnotation;
use App\Entity\Main\Account;
use App\Entity\Tenant\CalendarEvent;
use App\Entity\Tenant\CalendarEventInvitation;
use App\Entity\Tenant\Notification;
use App\Form\CalendarEventType;
use App\Service\AuthService;
use App\Service\WebsocketClient;
use DateTime;
use DateTimeImmutable;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


#[Route('/calendar')]
class CalendarController extends DefaultController
{
    #[Route('/invitationAnswer/{id}', methods:['POST'])]
    public function invitationAnswer(CalendarEventInvitation $invitation, Request $request) {
        $data = json_decode($request->getContent(), true);
        if(!$invitation || !isset($data['answer']))
            return new JsonResponse('bad request', Response::HTTP_BAD_REQUEST);

        $answer = intval($data['answer']);

        if($answer !== CalendarEventInvitation::ACCEPTED && $answer !== CalendarEventInvitation::DECLINED)
            return new JsonResponse('bad request', Response::HTTP_BAD_REQUEST);

        /** @var \App\Entity\Main\Account $user */
        $user = $this->security->getUser();

        if($invitation->getMemberId() !== $user->getId())
            return new JsonResponse('forbidden', Response::HTTP_FORBIDDEN);

        $invitation->setStatus($answer);
        $this->em->persist($invitation);
        $this->em->flush();

        return new JsonResponse('ok', Response::HTTP_OK);
    }

    #[Route('/events', methods:['GET'])]
    public function getMyEvents(Request $request) {
        /** @var \App\Entity\Main\Account $user */
        $user = $this->security->getUser();
        $begin = $request->query->get('begin'); 
        $end = $request->query->get('end');

        if(!$begin || !$end)
            return new JsonResponse('bad param', Response::HTTP_BAD_REQUEST);

        $begin = (new DateTime())->setTimestamp($begin / 1000);
        $end = (new DateTime())->setTimestamp($end / 1000);

        $qb = $this->em->getRepository(CalendarEvent::class)->createQueryBuilder('entity');
        $qb->innerJoin('entity.invitations', 'invitation')
                    ->where('invitation.memberId = :userId')->setParameter('userId', $user->getId())
                    ->andWhere('entity.beginDate >= :begin')->setParameter('begin', $begin)
                    ->andWhere('entity.beginDate <= :end')->setParameter('end', $end)
                    ->andWhere('invitation.status = :accepted')->setParameter('accepted', CalendarEventInvitation::ACCEPTED)
                    ->orWhere('entity.authorId = :userId');

        // $orX = $qb->expr()->orX();
        // $orX->add('invitation.status = :accepted')->add('invitation.status = :pending');
        // $qb->andWhere($orX)->setParameter('accepted', CalendarEventInvitation::ACCEPTED)->setParameter('pending', CalendarEventInvitation::PENDING);

        $data = $qb->getQuery()->getResult();

        return $this->jsonResponse($data, Response::HTTP_OK, ['get']);
    }

    #[Route('/events', methods:['POST'])]
    #[PermissionAnnotation(['ROLE_CALENDAR_EVENT_CREATE'])]
    public function createUpdateEvent(Request $request, AuthService $authService) {

        $myProfile = $authService->getMyProfile();

        return $this->autoSubmitWithBehavior(
            $request,
            CalendarEventType::class,
            CalendarEvent::class,
            [],
            function($submitHandler) use($request, $myProfile) {
                /** @var \App\Entity\Tenant\CalendarEvent $event */
                $event = $submitHandler->getEntity();
                $event->setAuthorId($myProfile->getId());
                $membersToInviteIds = $this->getPayload($request)['invitations'];

                if($submitHandler->getStatus() !== Response::HTTP_CREATED) {
                    $this->em->createQueryBuilder()
                        ->delete(CalendarEventInvitation::class, 'cei')
                        ->where('cei.id = :id')->setParameter('id', $event->getId())
                        ->andWhere('cei.memberId NOT IN (:profileIds)')->setParameter('profileIds', $membersToInviteIds)
                        ->getQuery()
                        ->execute();
                } else {
                    $this->em->persist($event);
                    $this->em->flush();
                }
                
                $existingInvitations = $this->em->getRepository(CalendarEventInvitation::class)->findBy(['calendarEvent' => $event]);
                $membersToInviteIds = array_diff($membersToInviteIds, array_map(fn($invitation) => $invitation->getMemberId, $existingInvitations));

                $notifModel = (new Notification())
                                        ->setContent($myProfile->getFirstname() . " " . $myProfile->getLastName() . " vous a invité à l'évènement ")
                                        ->setCreatedAt(new DateTimeImmutable())
                                        ->setType(Notification::TYPE_CALENDAR);

                $inviationNotifications = [];
                
                foreach($membersToInviteIds as $memberToInviteId) {

                    $invitation = (new CalendarEventInvitation())
                                        ->setMemberId($memberToInviteId)
                                        ->setCalendarEvent($event);
                    
                    $this->em->persist($invitation);

                    $notif = (clone $notifModel)->setRecipientId($memberToInviteId);

                    $inviationNotifications[] = [
                        'notification' => $notif,
                        'invitation' => $invitation
                    ];
                }

                $this->em->flush();

                foreach($inviationNotifications as &$data) {
                    $data['notification']->setExtraData(json_encode(
                        [
                            'event' => $this->jsonize($event, ['get']),
                            'invitationId' => $data['invitation']->getId()
                        ]
                    ));
                    $this->em->persist($data['notification']);
                }

                $this->em->flush();

                $websocket = new WebsocketClient("ws://127.0.0.1:8080", $this->serializer);
                $websocket->sendNotifications(array_map(fn($pair) => $pair['notification'], $inviationNotifications));
            }
        );
    }

    #[Route('/invitations', methods: ['GET'])]
    public function getPendingInvitations() {

        /** @var App\Entity\Main\Account $account */
        $account = $this->security->getUser();

        return $this->jsonResponse($this->em->getRepository(CalendarEventInvitation::class)->findBy([
            'memberId' => $account->getId(),
            'status' => CalendarEventInvitation::PENDING
        ]), Response::HTTP_OK, ['getinvitations']);
    }
}
