<?php

namespace App\Entity\Tenant;

use App\Repository\Tenant\TeamRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TeamRepository::class)]
class Team
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::JSON)]
    private array $memberIds = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getMemberIds(): array
    {
        return $this->memberIds;
    }

    public function setMemberIds(array $memberIds): static
    {
        $this->memberIds = $memberIds;

        return $this;
    }

    public function removeMemberId(int $id): static {
        $this->memberIds = array_filter($this->memberIds, fn($memberId) => $memberId !== $id);
        return $this;
    }

    public function addMemberId(int $id): static {
        if(!in_array($id, $this->memberIds))
            $this->memberIds[] = $id;
        return $this;
    }
}
