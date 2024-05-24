<?php

namespace App\Entity\Tenant;

use App\Repository\Tenant\AccountRoleProfilesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AccountRoleProfilesRepository::class)]
class AccountRoleProfiles
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $accountId = null;

    /**
     * @var Collection<int, RoleProfile>
     */
    #[ORM\ManyToMany(targetEntity: RoleProfile::class, fetch:"EAGER")]
    private Collection $roleProfiles;

    public function __construct()
    {
        $this->roleProfiles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAccountId(): ?int
    {
        return $this->accountId;
    }

    public function setAccountId(int $accountId): static
    {
        $this->accountId = $accountId;

        return $this;
    }

    /**
     * @return Collection<int, RoleProfile>
     */
    public function getRoleProfiles(): Collection
    {
        return $this->roleProfiles;
    }

    public function addRoleProfile(RoleProfile $roleProfile): static
    {
        if (!$this->roleProfiles->contains($roleProfile)) {
            $this->roleProfiles->add($roleProfile);
        }

        return $this;
    }

    public function setRoleProfiles(Collection $roleProfiles): static {
        $this->roleProfiles = $roleProfiles;

        return $this;
    }

    public function removeRoleProfile(RoleProfile $roleProfile): static
    {
        $this->roleProfiles->removeElement($roleProfile);

        return $this;
    }
}
