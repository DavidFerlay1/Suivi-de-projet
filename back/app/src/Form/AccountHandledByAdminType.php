<?php

namespace App\Form;

use App\Entity\Main\Account;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AccountHandledByAdminType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('username')
            ->add('firstname')
            ->add('lastName')
            ->add('roleProfileIds', CollectionType::class, [
                'entry_type' => NumberType::class, // Ou tout autre type de champ approprié
                'allow_add' => true,
                'allow_delete' => true,
                'prototype' => true,
                // Ajoutez d'autres options si nécessaire
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
