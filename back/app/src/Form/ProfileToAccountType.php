<?php

namespace App\Form;

use App\Entity\Main\Account;
use App\Entity\Main\Profile;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class ProfileToAccountType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('username', TextType::class, [
                'constraints' => [
                    new BindedProfileConstraint()
                ]
            ])
            ->add('firstname')
            ->add('lastName')
            ->add('roleProfileIds', CollectionType::class, [
                'entry_type' => IntegerType::class, // Ou tout autre type de champ approprié
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
            'validation_groups' => ['transform']
        ]);
    }
}

class BindedProfileConstraint extends Constraint {
    public $message = 'assert.profileDoesNotExists';
}

class BindedProfileConstraintValidator extends ConstraintValidator {

    public function __construct(private EntityManagerInterface $em, private Security $security){}

    public function validate(mixed $value, Constraint $constraint)
    {

        /** @var \App\Entity\Main\Account $currentUser */
        $currentUser = $this->security->getUser();

        $targetProfile = $this->em->getRepository(Profile::class)->findOneBy([
            'type' => 'profile',
            'username' => $value,
            'tenant' => $currentUser->getTenant()
        ]);

        if(!$targetProfile)
            $this->context->buildViolation($constraint->message)->addViolation();
    }
}
