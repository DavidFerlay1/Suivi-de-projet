<?php

namespace App\Form;

use App\Entity\Main\Account;
use App\Entity\Main\TenantDb;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\ConstraintValidator;

class TenantRegistrationType extends AbstractType
{
    public function __construct(private EntityManagerInterface $em)
    {
        
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('username')
            ->add('firstname')
            ->add('lastName')
            ->add('rawPassword', RepeatedType::class, [
                'type' => PasswordType::class
            ])
            ->add('organization', TextType::class, [
                'mapped' => false,
                'constraints' => [
                    new NotBlank(),
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Account::class,
        ]);
    }
}

class UniqueOrganizationNameContraint extends Constraint {
    public $message = 'assert.organizationNameAlreadyExists';
}

class UniqueOrganizationNameContraintValidator extends ConstraintValidator {

    public function __construct(private EntityManagerInterface $em){}

    public function validate($value, Constraint $constraint) {
        if($this->em->getRepository(TenantDb::class)->findOneBy(['organization' => $value])) {
            $this->context->buildViolation($constraint->message);
        }
    }
}
