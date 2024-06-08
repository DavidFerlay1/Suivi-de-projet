<?php

namespace App\Entity\Main;

use App\Repository\Main\ProfileRepository;
use App\Service\CsvService;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\DiscriminatorColumn;
use Doctrine\ORM\Mapping\DiscriminatorMap;
use Doctrine\ORM\Mapping\InheritanceType;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProfileRepository::class)]
#[UniqueEntity('username', message: 'assert.usernameAlreadyUsed', groups:['admin'])]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_USERNAME', fields: ['username'])]
#[InheritanceType('SINGLE_TABLE')]
#[DiscriminatorColumn(name:"type", type:"string")]
#[DiscriminatorMap([
    "proxy" => Profile::class,
    "account" => Account::class 
])]
class Profile
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('get')]
    protected ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['get', CsvService::CSV_HANDLED])]
    #[Assert\NotBlank(groups:['admin', 'transform'])]
    protected ?string $username = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['get', CsvService::CSV_HANDLED])]
    #[Assert\NotBlank(groups:['admin', 'transform'])]
    protected ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(groups:['admin', 'transform'])]
    #[Groups(['get', CsvService::CSV_HANDLED])]
    protected ?string $lastName = null;

    #[ORM\ManyToOne(inversedBy: 'profiles')]
    #[ORM\JoinColumn(nullable: false)]
    protected ?TenantDb $tenant = null;

    #[ORM\Column]
    #[Groups(['get', CsvService::CSV_HANDLED])]
    private ?bool $hasAccount = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getTenant(): ?TenantDb
    {
        return $this->tenant;
    }

    public function setTenant(?TenantDb $tenant): static
    {
        $this->tenant = $tenant;

        return $this;
    }

    public function hasAccount(): ?bool
    {
        return $this->hasAccount;
    }

    public function setHasAccount(bool $hasAccount): static
    {
        $this->hasAccount = $hasAccount;

        return $this;
    }
}
