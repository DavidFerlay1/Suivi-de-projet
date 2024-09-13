<?php

namespace App\Form\Constraints;

use App\Entity\Main\Profile;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Parameter;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class MembersConstraint extends Constraint {
    public $message = 'assert.illegalMember';
}

class MembersConstraintValidator extends ConstraintValidator {
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