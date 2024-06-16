<?php

namespace App\Form;

use App\Entity\Tenant\Achievable;
use App\Entity\Tenant\Project;
use App\Entity\Tenant\Tag;
use App\Entity\Tenant\Team;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProjectType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('createdAt', null, [
                'widget' => 'single_text',
            ])
            ->add('startedAt', null, [
                'widget' => 'single_text',
            ])
            ->add('finishedAt', null, [
                'widget' => 'single_text',
            ])
            ->add('status')
            ->add('duration')
            ->add('weight')
            ->add('title')
            ->add('description')
            ->add('parent', EntityType::class, [
                'class' => Achievable::class,
                'choice_label' => 'id',
            ])
            ->add('tags', EntityType::class, [
                'class' => Tag::class,
                'choice_label' => 'id',
                'multiple' => true,
            ])
            ->add('affectedTeams', EntityType::class, [
                'class' => Team::class,
                'multiple' => true
            ])
            ->add('affectedIndividualProfileIds', )
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Project::class,
        ]);
    }
}
