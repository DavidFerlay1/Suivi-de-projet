<?php

namespace App\Form;

use App\Entity\Tenant\RoleProfile;
use App\Service\RoleService;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RoleProfileType extends AbstractType
{

    public function __construct(private RoleService $roleService){}

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('roles', ChoiceType::class, [
                'multiple' => true,
                'choices' => $this->roleService->getRoles()
            ])
            ->add('name')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => RoleProfile::class,
        ]);
    }
}
