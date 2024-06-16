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

        foreach(array_keys($searchSettings[$entityName]['fields']) as $property) {

            $fieldSettings = $searchSettings[$entityName]['fields'][$property];
            if($fieldSettings['method'] === 'delegated')
            dd($fieldSettings);

            switch($fieldSettings['method']) {
                case 'like':
                    $orX->add($qb->expr()->like("$alias.$property", ":pattern"));
                    break;
                case 'delegate':
                    $orX->add($this->locator->getService($fieldSettings['delegated_service'])->{$fieldSettings['delegated_method']}($qb, $searchPattern, $alias));
                    break;
                default: break;
            }
            
        }
        $qb->setParameter('pattern', "%$searchPattern%");
        $qb->andWhere($orX);
         
        return $qb;
    }
}