<?php

namespace App\Entity\Main;

use App\Repository\Main\TenantDbRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Hakam\MultiTenancyBundle\Services\TenantDbConfigurationInterface;
use Hakam\MultiTenancyBundle\Traits\TenantDbConfigTrait;

#[ORM\Entity(repositoryClass: TenantDbRepository::class)]
class TenantDb implements TenantDbConfigurationInterface
{

    use TenantDbConfigTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, Profile>
     */
    #[ORM\OneToMany(targetEntity: Profile::class, mappedBy: 'tenant', orphanRemoval: true)]
    private Collection $profiles;

    #[ORM\Column(length: 255)]
    private ?string $organization = null;

    public function __construct()
    {
        $this->profiles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Profile>
     */
    public function getProfiles(): Collection
    {
        return $this->profiles;
    }

    public function addProfile(Profile $profile): static
    {
        if (!$this->profiles->contains($profile)) {
            $this->profiles->add($profile);
            $profile->setTenant($this);
        }

        return $this;
    }

    public function removeProfile(Profile $profile): static
    {
        if ($this->profiles->removeElement($profile)) {
            // set the owning side to null (unless already changed)
            if ($profile->getTenant() === $this) {
                $profile->setTenant(null);
            }
        }

        return $this;
    }

    public function getOrganization(): ?string
    {
        return $this->organization;
    }

    public function setOrganization(string $organization): static
    {
        $this->organization = $organization;

        return $this;
    }
}
