<?php

namespace App\Trait;

use App\Models\QueryFilters;
use Doctrine\ORM\QueryBuilder;
use QueryFiltersOptions;

trait QueryFiltersTrait {
    use PaginableTrait;
    use SortableTrait;
    use SearchableTrait;

    public function getFilteredQueryResultSet(string $entityName, QueryFilters $queryFilters, QueryBuilder $qb, string $alias = 'entity', QueryFiltersOptions $options = new QueryFiltersOptions()) {
        $qb = $this->filterBySearch($entityName, $queryFilters->getSearchPattern(), $qb, $alias);

        $totalFetchableCount = $this->getCountWithoutPagination($qb, $alias);
        $maxResults = $options->getMaxResult() ?? $this->maxPerPage;

        return [
            'lastPage' => intval($totalFetchableCount / $maxResults) + ($totalFetchableCount % $maxResults ? 1 : 0),
            'data' => $this->orderResultBy($queryFilters->getSortSetting(), $this->paginate($queryFilters->getPage(), $qb, $options))->getQuery()->getResult()
        ];
    }

    public function getCountWithoutPagination(QueryBuilder $qb, $alias) {
        $countQb = clone $qb;
        $countQb->resetDQLPart('select');
        $countQb->select("COUNT($alias.id)");

        return $countQb->getQuery()->getSingleScalarResult();
    }
}