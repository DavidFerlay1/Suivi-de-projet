<?php

namespace App\Entity\Tenant;

use App\Repository\Tenant\CalendarEventInvitationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: CalendarEventInvitationRepository::class)]
class CalendarEventInvitation
{
    const PENDING = 0;
    const ACCEPTED = 1;
    const DECLINED = -1;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['get', 'getinvitations'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['get'])]
    private ?int $memberId = null;

    #[ORM\Column]
    #[Groups(['get', 'getinvitations'])]
    private ?int $status = null;

    #[ORM\ManyToOne(inversedBy: 'invitations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(('getinvitations'))]
    private ?CalendarEvent $calendarEvent = null;

    public function __construct()
    {   
        $this->status = self::PENDING;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMemberId(): ?int
    {
        return $this->memberId;
    }

    public function setMemberId(int $memberId): static
    {
        $this->memberId = $memberId;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCalendarEvent(): ?CalendarEvent
    {
        return $this->calendarEvent;
    }

    public function setCalendarEvent(?CalendarEvent $calendarEvent): static
    {
        $this->calendarEvent = $calendarEvent;

        return $this;
    }
}
