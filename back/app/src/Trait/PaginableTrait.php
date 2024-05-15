<?php

namespace App\Trait;

use Doctrine\ORM\QueryBuilder;

trait PaginableTrait {

    private $maxPerPage = 10;
    private $countMethod = null;

    protected function paginate(int|null $page, QueryBuilder $queryBuilder) {
        return $queryBuilder->setFirstResult(($page ? $page -1 : 0) * $this->maxPerPage)->setMaxResults($this->maxPerPage);
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