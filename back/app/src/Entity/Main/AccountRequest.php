<?php

namespace App\Entity\Main;

use App\Repository\Main\AccountRequestRepository;
use DateInterval;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

enum REQUEST_TYPE: int {
    case RESET_PASSWORD = 1;
    case REGISTRATION = 2;
}

enum REQUEST_TTL: int {
    case RESET_PASSWORD = 600;
    case REGISTRATION = 3600;
}

#[ORM\Entity(repositoryClass: AccountRequestRepository::class)]
class AccountRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'requests')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Account $account = null;

    #[ORM\Column]
    private ?int $type = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $expiresAt = null;

    #[ORM\Column(length: 255)]
    private ?string $token = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAccount(): ?Account
    {
        return $this->account;
    }

    public function setAccount(?Account $account): static
    {
        $this->account = $account;

        return $this;
    }

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getExpiresAt(): ?\DateTimeImmutable
    {
        return $this->expiresAt;
    }

    public function setExpiresAt(\DateTimeImmutable $expiresAt): static
    {
        $this->expiresAt = $expiresAt;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): static
    {
        $this->token = $token;

        return $this;
    }

    public static function create(REQUEST_TYPE $type, Account $account) {
        switch($type) {
            case REQUEST_TYPE::RESET_PASSWORD:
                $ttl = REQUEST_TTL::RESET_PASSWORD->value;
                break;
            case REQUEST_TYPE::REGISTRATION:
                $ttl = REQUEST_TTL::REGISTRATION->value;
                break;
            default: 
                $ttl = 0; 
                break;
        }

        return (new AccountRequest())
                    ->setExpiresAt((new DateTimeImmutable())->add(new DateInterval("PT" . $ttl . "S")))
                    ->setType($type->value)
                    ->setAccount($account)
                    ->setToken(Uuid::v4());
    }
}
