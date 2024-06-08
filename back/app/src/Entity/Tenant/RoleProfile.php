<?php

namespace App\Entity\Tenant;

use App\Repository\Tenant\RoleProfileRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RoleProfileRepository::class)]
class RoleProfile
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['light', 'get'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Assert\NotNull]
    private array $roles = [];

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['light', 'get'])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(['light', 'get'])]
    private ?bool $immutable = null;

    #[ORM\Column]
    private ?bool $settable = null;

    #[ORM\Column]
    private ?bool $listable = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
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
    
    public function isImmutable(): ?bool
    {
        return $this->immutable;
    }

    public function setImmutable(bool $immutable): static
    {
        $this->immutable = $immutable;

        return $this;
    }

    public function isSettable(): ?bool
    {
        return $this->settable;
    }

    public function setSettable(bool $settable): static
    {
        $this->settable = $settable;

        return $this;
    }

    public function isListable(): ?bool
    {
        return $this->listable;
    }

    public function setListable(bool $listable): static
    {
        $this->listable = $listable;

        return $this;
    }
}
