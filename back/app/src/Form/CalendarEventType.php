<?php

namespace App\Form;

use App\Entity\Main\Profile;
use App\Entity\Tenant\CalendarEvent;
use App\Form\Constraints\MembersConstraint;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Parameter;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\Callback;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

class CalendarEventType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title')
            ->add('description')
            ->add('beginDate', null, [
                'widget' => 'single_text',
            ])
            ->add('endDate', null, [
                'widget' => 'single_text'
            ])
            // ->add('invitations', CollectionType::class, [
            //     'entry_type' => NumberType::class,
            //     'allow_add' => true,
            //     'allow_delete' => true,
            //     'constraints' => [
            //         new MembersConstraint()
            //     ],
            // ])
        ;

        $builder->addEventListener(FormEvents::PRE_SUBMIT, function (FormEvent $event) {
            $data = $event->getData();
            unset($data['invitations']);

            if(isset($data['beginDateMillis'])) {
                $data['beginDate'] = (new DateTime())->setTimestamp($data['beginDateMillis'] / 1000)->format('Y-m-d H:i:s');
                unset($data['beginDateMillis']);
            }

            if(isset($data['endDateMillis'])) {
                $data['endDate'] = (new DateTime())->setTimestamp($data['endDateMillis'] / 1000)->format('Y-m-d H:i:s');
                unset($data['endDateMillis']);
            }

            $event->setData($data);
        });
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => CalendarEvent::class,
            'constraints' => [
                new DateRangeConstraint()
            ]
        ]);
    }
}

class DateRangeConstraint extends Constraint {
    public $message = 'assert.invalidDateRange';
}

class DateRangeConstraintValidator extends ConstraintValidator {
    public function validate(mixed $object, Constraint $constraint)
    {
        if($object->getBeginDate() >= $object->getEndDate())
            $this->context->buildViolation($constraint->message)
                    ->addViolation();
    }
}
