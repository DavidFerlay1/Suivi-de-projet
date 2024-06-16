<?php

namespace App\Entity\Tenant;

use App\Repository\Tenant\TeamRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: TeamRepository::class)]
class Team
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['light'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['light'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::JSON)]
    private array $memberIds = [];

    #[Groups(['light'])]
    private Collection $members;

    /**
     * @var Collection<int, Achievable>
     */
    #[ORM\ManyToMany(targetEntity: Achievable::class, mappedBy: 'affectedTeams')]
    private Collection $affectations;

    public function __construct()
    {
        $this->members = new ArrayCollection();
        $this->affectations = new ArrayCollection();
    }

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

    public function getMembers() {
        return $this->members;
    }

    public function setMembers(Collection $members): static {
        $this->members = $members;
        return $this;
    }

    /**
     * @return Collection<int, Achievable>
     */
    public function getAffectations(): Collection
    {
        return $this->affectations;
    }

    public function addAffectation(Achievable $affectation): static
    {
        if (!$this->affectations->contains($affectation)) {
            $this->affectations->add($affectation);
            $affectation->addAffectedTeam($this);
        }

        return $this;
    }

    public function removeAffectation(Achievable $affectation): static
    {
        if ($this->affectations->removeElement($affectation)) {
            $affectation->removeAffectedTeam($this);
        }

        return $this;
    }
}
