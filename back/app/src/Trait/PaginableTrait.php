<?php

namespace App\Trait;

use Doctrine\ORM\QueryBuilder;
use QueryFiltersOptions;

trait PaginableTrait {

    protected $maxPerPage = 10;

    protected function paginate(int|null $page, QueryBuilder $queryBuilder, QueryFiltersOptions $options = new QueryFiltersOptions()) {
        $max = $options->getMaxResult() ?? $this->maxPerPage;
        return $queryBuilder->setFirstResult(($page ? $page -1 : 0) * $max)->setMaxResults($max);
    }

    protected function initPaginationSettings(int $maxPerPage) {
        $this->maxPerPage = $maxPerPage;
    }

    protected function standardize(mixed $data, int $count, int|null $page) {
        $result = [
            'data' => $data,
            'total' => $count,
            'perPage' => $this->maxPerPage,
            'page' => $page ?? 1
        ];

        $loaded = $page ? $page * $this->maxPerPage : $this->maxPerPage;
        if($loaded > $count)
            $loaded = $count;

        $result['loaded'] = $loaded;
        return $result;
    }
}