<?php

namespace App\Trait;

use Doctrine\ORM\QueryBuilder;

trait QueryFiltersTrait {
    use PaginableTrait;
    use SortableTrait;

    public function withQueryFilters(QueryBuilder $qb, int|null $page, array|null $orderSettings, $alias = 'entity') {

        $totalFetchableCount = $this->getCountWithoutPagination($qb, $alias);

        return [
            "lastPage" => intval($totalFetchableCount / $this->maxPerPage) + ($totalFetchableCount % $this->maxPerPage ? 1 : 0),
            "data" => $this->orderResultBy($orderSettings, $this->paginate($page, $qb))->getQuery()->getResult()
        ];
    }

    public function getCountWithoutPagination(QueryBuilder $qb, $alias) {
        $countQb = clone $qb;
        $countQb->resetDQLPart('select');
        $countQb->select("COUNT($alias.id)");

        return $countQb->getQuery()->getSingleScalarResult();
    }
}