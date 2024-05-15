<?php

namespace App\Listeners;

use App\Entity\Tenant\STATUS;
use App\Entity\Tenant\Task;
use Doctrine\ORM\Event\OnFlushEventArgs;

class TaskStatusHandler {

    public function onFlush(OnFlushEventArgs $args) {
        $em = $args->getObjectManager();
        $uow = $em->getUnitOfWork();

        foreach($uow->getScheduledEntityUpdates() as $entity) {
            if(!($entity instanceof Task))
                return;

            $listenedProperties = ['status'];
            $updates = array_intersect($listenedProperties, array_keys($uow->getEntityChangeSet($entity)));

            if(count($updates))
                $this->manageParentRecursively($entity, $em, $uow);
        }  
    }

    public function manageParentRecursively(Task $target, $em, $uow) {
        $parent = $target->getParent();
        $changed = false;

        if($parent->getStatus() === STATUS::ACHIEVED->value && $target->getStatus() !== STATUS::ACHIEVED->value) {
            $parent->setStatus(STATUS::IN_PROGRESS->value);
            $changed = true;
        }
        else if($parent->getStatus() !== STATUS::ACHIEVED->value && $target->getStatus() === STATUS::ACHIEVED->value) {
            $switchToAchieved = true;
            foreach($parent->getChildren() as $task) {
                if($task->getStatus() !== STATUS::ACHIEVED->value) {
                    $switchToAchieved = false;
                    return;
                }  
            }

            if($switchToAchieved) {
                $parent->setStatus(STATUS::ACHIEVED->value);
                $changed = true;
            }
        }

        $em->persist($parent);
        $uow->computeChangeSet($em->getClassMetaData(get_class($parent)), $parent);

        if($changed && $parent instanceof Task)
            $this->manageParentRecursively($parent, $em, $uow);
    }
}