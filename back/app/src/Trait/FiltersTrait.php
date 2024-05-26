<?php

namespace App\Trait;

use App\Models\QueryFilters;
use App\Trait\ParamAccessorTrait;
use Doctrine\ORM\QueryBuilder;

trait FiltersTrait {

    use ParamAccessorTrait;

    public function applyFilters(string $entityName, QueryBuilder $queryBuilder, QueryFilters $queryFilters, string $alias = 'entity') {
        if(!count($queryFilters->getFilters()))
            return $queryBuilder;

        $settings = $this->params->get('filters');
        if(!$settings)
            return $queryBuilder;

        $settings = $settings[$entityName];
        
        foreach($queryFilters->getFilters() as $key => $filterExpression) {
            if(isset($settings[$key])) {
                $currentSettings = $settings[$key];
                $filteredValues = explode(';', $filterExpression);
                if(!$filteredValues[0])
                    return;

                $field = $currentSettings['field_name'];

                switch($currentSettings['mod']) {
                    case 'default':
                        $queryBuilder->andWhere($queryBuilder->expr()->in("$alias.$field", ":$key"))->setParameter($key, $filteredValues);
                        break;
                    case 'delegate':
                        $queryBuilder = $this->locator->getService($currentSettings['delegated_service'])->{$currentSettings['delegated_method']}($queryBuilder, $filteredValues);
                        break;
                    default: return;
                }
            }
        }

        return $queryBuilder;
    }
}