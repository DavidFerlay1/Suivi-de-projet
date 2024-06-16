<?php

namespace App\Form;

use App\Entity\Main\Account;
use App\Entity\Main\Profile;
use App\Entity\Tenant\Team;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\Parameter;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\ConstraintValidator;

class TeamType extends AbstractType
{

    public function __construct(private EntityManagerInterface $mainEm, private TenantEntityManager $em, private Security $security)
    {
        
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('memberIds', CollectionType::class, [
                'entry_type' => NumberType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'constraints' => [
                    new TeamMembersConstraint()
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Team::class,
        ]);
    }
}

class TeamMembersConstraint extends Constraint {
    public $message = 'assert.illegalMember';
}

class TeamMembersConstraintValidator extends ConstraintValidator {

    public function __construct(private EntityManagerInterface $mainEm, private Security $security)
    {
        
    }

    public function validate(mixed $value, Constraint $constraint)
    {
        $formatted = array_map(fn($v) => intval($v), $value);

        if(!empty($formatted)) {
            /** @var \App\Entity\Main\Account $user */
            $user = $this->security->getUser();
            $qb = $this->mainEm->getRepository(Profile::class)->createQueryBuilder('profile');
            $result = $qb->select('profile.id')
                            ->where($qb->expr()->in('profile.id', ':ids'))
                            ->andWhere('profile.tenant = :tenant')
                            ->setParameters(new ArrayCollection([
                                new Parameter('ids', $formatted),
                                new Parameter('tenant', $user->getTenant())
                            ]))->getQuery()->getScalarResult();
            
            if(!empty(array_diff($formatted, array_map(fn($r) => $r['id'], $result)))) {
                $this->context->buildViolation($constraint->message)->addViolation();
            }
        }
    }
}
