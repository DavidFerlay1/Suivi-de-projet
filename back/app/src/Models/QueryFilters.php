<?php

namespace App\Models;

class QueryFilters {
    public function __construct(private int|null $page = 1, private array $sortSetting, private string $searchPattern = '', private array $filters = []){}

    public function getPage(): int {
        if(!$this->page)
            return 1;
        return $this->page;
    }

    public function getSortSetting(): array {
        return $this->sortSetting;
    }

    public function getSearchPattern(): string {
        return $this->searchPattern;
    }

    public function getFilters(): array {
        return $this->filters;
    }
}