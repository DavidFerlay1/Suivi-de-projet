<?php

namespace App\Entity\Tenant;

use App\Repository\Tenant\TaskRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

enum STATUS: int {
    case TODO = -1;
    case IN_PROGRESS = 0;
    case ACHIEVED = 1;
    case CLOSED = 2;
}

#[ORM\Entity(repositoryClass: TaskRepository::class)]
class Task extends Achievable
{

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    /**
     * @var Collection<int, Tag>
     */
    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'tasks')]
    private Collection $tags;

    #[ORM\ManyToOne(inversedBy: 'tasks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Project $rootParent = null;

    public function __construct()
    {
        $this->tags = new ArrayCollection();
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, Tag>
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function addTag(Tag $tag): static
    {
        if (!$this->tags->contains($tag)) {
            $this->tags->add($tag);
        }

        return $this;
    }

    public function removeTag(Tag $tag): static
    {
        $this->tags->removeElement($tag);

        return $this;
    }

    public function getRootParent(): ?Project
    {
        return $this->rootParent;
    }

    public function setRootParent(?Project $rootParent): static
    {
        $this->rootParent = $rootParent;

        return $this;
    }
}
