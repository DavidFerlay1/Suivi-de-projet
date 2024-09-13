<?php

namespace App\Entity\Tenant;

use App\Repository\Tenant\NotificationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: NotificationRepository::class)]
class Notification
{
    const TYPE_ALERT = 'alert';
    const TYPE_CALENDAR = 'calendar';
    const TYPE_SILENT = 'silent';
    const TYPE_AUTHENTICATION_FAILED = 'auth_failed';
    const TYPE_AUTENTICATION_SUCCEED = 'auth_succeed';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['get'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['get'])]
    private ?string $content = null;

    #[ORM\Column]
    private ?int $recipientId = null;

    #[ORM\Column]
    #[Groups(['get'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 50)]
    #[Groups(['get'])]
    private ?string $type = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['get'])]
    private ?string $extra_data = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getRecipientId(): ?int
    {
        return $this->recipientId;
    }

    public function setRecipientId(int $recipientId): static
    {
        $this->recipientId = $recipientId;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function asWebsocketMessage(): string {
        return json_encode(
            [
                'type' => $this->type,
                'content' => $this->content,
                'createdAt' => $this->createdAt,
                'id' => $this->id,
                'extra_data' => $this->extra_data
            ]
        );
    }

    public function getExtraData(): ?string
    {
        return $this->extra_data;
    }

    public function setExtraData(?string $extra_data): static
    {
        $this->extra_data = $extra_data;

        return $this;
    }
}
