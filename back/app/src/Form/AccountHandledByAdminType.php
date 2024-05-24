<?php

namespace App\Form;

use App\Entity\Main\Account;
use App\Entity\Tenant\RoleProfile;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AccountHandledByAdminType extends AbstractType
{

    public function __construct(private TenantEntityManager $em)
    {
        
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('username')
            ->add('firstname')
            ->add('lastName')
            ->add('roleProfiles', EntityType::class, [
                'class' => RoleProfile::class,
                'multiple' => true,
                'em' => $this->em
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Account::class,
            'validation_groups' => ['admin']
        ]);
    }
}
