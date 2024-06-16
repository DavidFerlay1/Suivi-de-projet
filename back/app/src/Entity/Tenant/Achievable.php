<?php

namespace App\Entity\Tenant;

use App\Repository\Tenant\AchievableRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\DiscriminatorColumn;
use Doctrine\ORM\Mapping\DiscriminatorMap;
use Doctrine\ORM\Mapping\InheritanceType;

#[ORM\Entity(repositoryClass: AchievableRepository::class)]
#[InheritanceType("SINGLE_TABLE")]
#[DiscriminatorColumn(name:"type", type:"string")]
#[DiscriminatorMap([
    "achievable" => Achievable::class,
    "task" => Task::class,
    "project" => Project::class 
])]
class Achievable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $startedAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $finishedAt = null;

    #[ORM\Column]
    private ?int $status = null;

    #[ORM\Column(nullable: true)]
    private ?int $duration = null;

    #[ORM\Column(nullable: true)]
    private ?int $weight = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    private ?self $parent = null;

    /**
     * @var Collection<int, self>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent')]
    private Collection $children;

    /**
     * @var Collection<int, Team>
     */
    #[ORM\ManyToMany(targetEntity: Team::class, inversedBy: 'affectations')]
    private Collection $affectedTeams;

    #[ORM\Column(type: Types::ARRAY)]
    private array $affectedIndividualProfileIds = [];

    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->affectedTeams = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getStartedAt(): ?\DateTimeInterface
    {
        return $this->startedAt;
    }

    public function setStartedAt(?\DateTimeInterface $startedAt): static
    {
        $this->startedAt = $startedAt;

        return $this;
    }

    public function getFinishedAt(): ?\DateTimeInterface
    {
        return $this->finishedAt;
    }

    public function setFinishedAt(?\DateTimeInterface $finishedAt): static
    {
        $this->finishedAt = $finishedAt;

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

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(?int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getWeight(): ?int
    {
        return $this->weight;
    }

    public function setWeight(?int $weight): static
    {
        $this->weight = $weight;

        return $this;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function setParent(?self $parent): static
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    public function addChild(self $child): static
    {
        if (!$this->children->contains($child)) {
            $this->children->add($child);
            $child->setParent($this);
        }

        return $this;
    }

    public function removeChild(self $child): static
    {
        if ($this->children->removeElement($child)) {
            // set the owning side to null (unless already changed)
            if ($child->getParent() === $this) {
                $child->setParent(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Team>
     */
    public function getAffectedTeams(): Collection
    {
        return $this->affectedTeams;
    }

    public function addAffectedTeam(Team $affectedTeam): static
    {
        if (!$this->affectedTeams->contains($affectedTeam)) {
            $this->affectedTeams->add($affectedTeam);
        }

        return $this;
    }

    public function removeAffectedTeam(Team $affectedTeam): static
    {
        $this->affectedTeams->removeElement($affectedTeam);

        return $this;
    }

    public function getAffectedIndividualProfileIds(): array
    {
        return $this->affectedIndividualProfileIds;
    }

    public function setAffectedIndividualProfileIds(array $affectedIndividualProfileIds): static
    {
        $this->affectedIndividualProfileIds = $affectedIndividualProfileIds;

        return $this;
    }
}
