<?php

namespace App\Listeners;

use App\Entity\Tenant\Achievable;
use App\Entity\Tenant\Task;
use Doctrine\ORM\Event\OnFlushEventArgs;

class TaskMetricsHandler {

    public function onFlush(OnFlushEventArgs $args) {
        $em = $args->getObjectManager();
        $uow = $em->getUnitOfWork();

        $listenedProperties = ['weight', 'duration'];

        foreach($uow->getScheduledEntityUpdates() as $entity) {
            if(!($entity instanceof Task))
                return;

            $changeSet = $uow->getEntityChangeSet($entity);
            $updates = array_intersect(array_keys($changeSet), $listenedProperties);

            if(count($updates))
                $this->manageParentRecursively($entity, $updates, $em, $uow);
        }

        foreach($uow->getScheduledEntityInsertions() as $entity) {
            if(!($entity instanceof Task))
                return;

            $this->manageParentRecursively($entity, $listenedProperties, $em, $uow, $entity);
        }
    }

    public function manageParentRecursively(Achievable $target, array $metrics, $em, $uow, $prePersistedAchievable = null) {
        $parent = $target->getParent();

        foreach($metrics as $metric) {
            $achieved = $prePersistedAchievable ? $prePersistedAchievable->{"get".ucfirst($metric)}() : 0;
            foreach($parent->getChildren() as $child) {
                $value = $child->{"get$metric"}();
                if($value !== null)
                    $achieved += $value;
            }

            $parent->{"set$metric"}($achieved);
        }

        $em->persist($parent);
        $uow->computeChangeSet($em->getClassMetaData(get_class($parent)), $parent);

        if($parent instanceof Task)
            $this->manageParentRecursively($parent, $metrics, $em, $uow);
    }
}