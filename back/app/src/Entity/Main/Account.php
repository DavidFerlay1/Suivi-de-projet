<?php

namespace App\Entity\Main;

use App\Entity\Tenant\RoleProfile;
use App\Repository\Main\AccountRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AccountRepository::class)]
class Account extends Profile implements UserInterface, PasswordAuthenticatedUserInterface
{
    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[Assert\NotBlank]
    private ?string $rawPassword = null;

    /**
     * @var Collection<int, AccountRequest>
     */
    #[ORM\OneToMany(targetEntity: AccountRequest::class, mappedBy: 'account', orphanRemoval: true)]
    private Collection $requests;

    #[ORM\Column]
    private array $roleProfileIds = [];

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function addRole(string $role): static
    {
        $this->roles[] = $role;
        return $this;
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getRawPassword(): string {
        return $this->rawPassword;
    }

    public function setRawPassword(string $rawPassword): static {
        $this->rawPassword = $rawPassword;
        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, AccountRequest>
     */
    public function getRequests(): Collection
    {
        return $this->requests;
    }

    public function addRequest(AccountRequest $request): static
    {
        if (!$this->requests->contains($request)) {
            $this->requests->add($request);
            $request->setAccount($this);
        }

        return $this;
    }

    public function removeRequest(AccountRequest $request): static
    {
        if ($this->requests->removeElement($request)) {
            // set the owning side to null (unless already changed)
            if ($request->getAccount() === $this) {
                $request->setAccount(null);
            }
        }

        return $this;
    }

    public function getRoleProfileIds(): array
    {
        return $this->roleProfileIds;
    }

    public function setRoleProfileIds(array $roleProfileIds): static
    {
        $this->roleProfileIds = $roleProfileIds;

        return $this;
    }

    public function addRoleProfileId(int $id): static {
        $this->roleProfileIds[] = $id;
        return $this;
    }

    public function removeProfileId(int $id): static {
        $this->roleProfileIds = array_diff($this->roleProfileIds, [$id]);
        return $this;
    }
}
