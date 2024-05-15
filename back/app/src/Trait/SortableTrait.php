<?php

namespace App\Trait;

use Doctrine\ORM\QueryBuilder;

trait SortableTrait {
    public function orderResultBy(array|null $sortSettings, QueryBuilder $qb, string $alias = 'entity') {
        if(!$sortSettings)
            return $qb;

        return $qb->orderBy("$alias.".$sortSettings['sortBy'], $sortSettings['orderBy']);
    }
}