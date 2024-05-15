<?php

namespace App\Trait;

use Doctrine\ORM\QueryBuilder;

trait QueryFiltersTrait {
    use PaginableTrait;
    use SortableTrait;

    public function withQueryFilters(QueryBuilder $qb, int|null $page, array|null $orderSettings) {
        return $this->orderResultBy($orderSettings, $this->paginate($page, $qb));
    }
}