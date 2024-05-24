<?php

namespace App\Trait;

use Doctrine\ORM\QueryBuilder;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

trait SearchableTrait {

    use ParamAccessorTrait;

    protected function filterBySearch(string $entityName, string $searchPattern, QueryBuilder $qb, $alias = 'entity') {
        $searchSettings = $this->params->get('search');
        if(!$searchPattern || !array_key_exists($entityName, $searchSettings))
            return $qb;

        $orX = $qb->expr()->orX();

        foreach(array_keys($searchSettings[$entityName]) as $property) {
            $orX->add($qb->expr()->like("$alias.$property", ":pattern"));
        }
        $qb->setParameter('pattern', "%$searchPattern%");
        $qb->andWhere($orX);
         
        return $qb;
    }
}